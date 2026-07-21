import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Host session required' }, { status: 401 });
    }

    // Strictly enforce host session
    if (user.role !== 'host') {
      return NextResponse.json({ error: 'Access Denied: This feature is only for host sessions' }, { status: 403 });
    }

    const hostId = Number(user.sub);
    if (!hostId || isNaN(hostId)) {
      return NextResponse.json({ error: 'Invalid host ID in session' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Server configuration error: Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify host exists in hosts table
    const { data: hostRecord, error: hostErr } = await supabase
      .from('hosts')
      .select('id, full_name, phone')
      .eq('id', hostId)
      .single();

    if (hostErr || !hostRecord) {
      return NextResponse.json({ error: `Registered host not found for ID ${hostId}` }, { status: 404 });
    }

    const formData = await request.formData();

    // 1. Extract Vehicle Specifications from FormData
    const make = (formData.get('make') || formData.get('carBrand') || '').toString().trim();
    const model = (formData.get('model') || formData.get('carName') || '').toString().trim();
    const modelYearStr = (formData.get('model_year') || formData.get('year') || '').toString().trim();
    const model_year = modelYearStr ? parseInt(modelYearStr, 10) : new Date().getFullYear();
    const color = (formData.get('color') || '').toString().trim();
    const vehicle_type = (formData.get('vehicle_type') || formData.get('vehicleType') || 'SUV').toString().trim();
    const fuel_type = (formData.get('fuel_type') || formData.get('fuelType') || 'Petrol').toString().trim();
    const transmission_type = (formData.get('transmission_type') || formData.get('transmission') || 'Manual').toString().trim();
    const seatingCapacityStr = (formData.get('seating_capacity') || formData.get('seats') || '5').toString().trim();
    const seating_capacity = parseInt(seatingCapacityStr, 10) || 5;

    const registration_number = (formData.get('registration_number') || formData.get('registration') || '').toString().trim().toUpperCase();
    const mileageStr = (formData.get('mileage_kmpl') || formData.get('mileage') || '15').toString().trim();
    const mileage_kmpl = parseFloat(mileageStr) || 15;
    const description = (formData.get('description') || '').toString().trim();

    const city = (formData.get('city') || 'Bengaluru').toString().trim();
    const location_name = (formData.get('location_name') || formData.get('area') || formData.get('street') || 'Hub Location').toString().trim();
    const baseDailyRateStr = (formData.get('base_daily_rate') || formData.get('pricePerDay') || '2000').toString().trim();
    const base_daily_rate = parseFloat(baseDailyRateStr) || 2000;

    if (!make || !model || !registration_number) {
      return NextResponse.json({ error: 'Make, model, and registration number are required' }, { status: 400 });
    }

    // 2. Compute Host Code (e.g. HOST04) and Next Sequence Number
    const hostPrefix = `HOST${String(hostId).padStart(2, '0')}`;

    // Query existing vehicles for this host to extract max sequence number
    const { data: existingVehicles, error: vehQueryErr } = await supabase
      .from('vehicles')
      .select('vehicle_code')
      .eq('host_id', hostId);

    if (vehQueryErr) {
      console.error('Error fetching host vehicles for code calculation:', vehQueryErr);
    }

    let maxSeq = 0;
    if (existingVehicles && existingVehicles.length > 0) {
      existingVehicles.forEach((v) => {
        if (v.vehicle_code && typeof v.vehicle_code === 'string') {
          const match = v.vehicle_code.match(/-(\d+)$/);
          if (match) {
            const seq = parseInt(match[1], 10);
            if (!isNaN(seq) && seq > maxSeq) {
              maxSeq = seq;
            }
          }
        }
      });
    }

    const nextSeq = maxSeq + 1;
    const carSeqStr = String(nextSeq).padStart(3, '0');
    const vehicle_code = `${hostPrefix}-${carSeqStr}`; // e.g. HOST04-007

    // 3. Insert Vehicle Record into DB
    const { data: insertedVehicle, error: insertVehErr } = await supabase
      .from('vehicles')
      .insert([
        {
          host_id: hostId,
          vehicle_code,
          make,
          model,
          model_year,
          color,
          registration_number,
          city,
          location_name,
          vehicle_type,
          fuel_type,
          transmission_type,
          seating_capacity,
          mileage_kmpl,
          description,
          base_daily_rate,
          available_status: true,
        },
      ])
      .select()
      .single();

    if (insertVehErr || !insertedVehicle) {
      console.error('Failed to insert vehicle into database:', insertVehErr);
      return NextResponse.json({ error: `Failed to insert vehicle: ${insertVehErr?.message}` }, { status: 500 });
    }

    const vehicleId = insertedVehicle.id;

    // 4. Upload Image Files to Supabase Storage Bucket ('car-images')
    const imageKeys = ['main', 'front', 'side', 'interior', 'rear'];
    const uploadedImages = [];

    const imageFieldsMap: Record<string, string[]> = {
      main: ['main', 'mainImage'],
      front: ['front', 'frontImage'],
      side: ['side', 'sideImage'],
      interior: ['interior', 'inside', 'insideImage'],
      rear: ['rear', 'back', 'backImage'],
    };

    let hasPrimary = false;

    for (const typeKey of imageKeys) {
      let file: File | null = null;
      const possibleFieldNames = imageFieldsMap[typeKey];

      for (const fieldName of possibleFieldNames) {
        const potentialFile = formData.get(fieldName);
        if (potentialFile && potentialFile instanceof File && potentialFile.size > 0) {
          file = potentialFile;
          break;
        }
      }

      if (file) {
        const mimeType = file.type || 'image/png';
        let ext = 'png';
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
        else if (mimeType.includes('webp')) ext = 'webp';

        // Format filename: HOST04-007-front.png
        const filename = `${vehicle_code}-${typeKey}.${ext}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload directly to root of 'car-images' bucket
        const { error: uploadErr } = await supabase.storage
          .from('car-images')
          .upload(filename, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadErr) {
          console.error(`Failed to upload ${filename} to car-images bucket:`, uploadErr);
        } else {
          const isPrimary = typeKey === 'main' || (!hasPrimary && typeKey === 'front');
          if (isPrimary) hasPrimary = true;

          // Insert row into vehicle_images
          const { data: imgRow, error: imgDbErr } = await supabase
            .from('vehicle_images')
            .insert([
              {
                vehicle_id: vehicleId,
                image_url: filename,
                is_primary: isPrimary,
              },
            ])
            .select()
            .single();

          if (imgDbErr) {
            console.error(`Failed to insert vehicle_image row for ${filename}:`, imgDbErr);
          } else {
            uploadedImages.push(imgRow);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        vehicle: insertedVehicle,
        images: uploadedImages,
      },
    });
  } catch (error: any) {
    console.error('Unexpected error in POST /api/hub/cars/add:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
