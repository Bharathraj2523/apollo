// src/app/api/doctors/route.js
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = 'mongodb+srv://Bharathraj:bharath%40123@cluster0.tvh8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db('apollo');
    const collection = database.collection('doctors');

    const doctors = await collection.find({}).toArray();
    return NextResponse.json(doctors);

  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  try {
    const doctorData = await request.json();
    
    // Validate the incoming data
    if (!doctorData.name || !doctorData.specialization) {
      return NextResponse.json(
        { message: 'Name and specialization are required' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db('apollo');
    const collection = database.collection('doctors');

    const result = await collection.insertOne(doctorData);
    
    return NextResponse.json(
      { message: 'Doctor created successfully', id: result.insertedId },
      { status: 201 }
    );

  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}