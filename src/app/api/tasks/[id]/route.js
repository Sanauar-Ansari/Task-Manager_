import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task';

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await request.json();
    const task = await Task.findByIdAndUpdate(id, data, { new: true });
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task updated', task }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating task', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting task', error: error.message }, { status: 500 });
  }
}