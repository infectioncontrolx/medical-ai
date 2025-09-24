import { NextResponse } from 'next/server';

import { connectTODB } from '../../../lib/conn';
import { CommonResponse } from '../../../lib/server/func';
import ChatList from '../../models/ChatList.model';
export async function GET(request) {
  try {
    await connectTODB();

    // Get the URL and parse query parameters

    const { searchParams } = new URL(request.url);
    let pageNum = parseInt(searchParams.get('page')) || 1;
    let limitNum = parseInt(searchParams.get('limit')) || 10;
    let lang = searchParams.get('lang') || '';

    const skip = (pageNum - 1) * limitNum;

    // console.log(lang,'lang')
    // Fetch feedbacks with pagination
    const data = await ChatList.find({ lang: lang.trim() })
      .skip(skip)
      .limit(limitNum)
      .sort('-createdAt')
      .lean();
    const totalCount = await ChatList.countDocuments({ lang: lang.trim() });
    // const uniqueCount = await ChatList.distinct('_id', { lang: lang.trim() }).then(ids => ids.length);// Example: Count unique users for a specific language
const uniqueCount = await ChatList.distinct('userId', { lang: lang.trim() }).then(ids => ids.length);

    console.log({data})

    const paginate = {
      totalCount: totalCount,
      uniqueCount: uniqueCount,
      totalPage: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      currentLimit: limitNum,
      hasNextPage: data.length === limitNum,
    };

    // Include pagination data in the response
    return NextResponse.json(
      CommonResponse.success(200, 'Chat fetch!', data, paginate)
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      CommonResponse.error(400, 'Failed to fetch Chat', null)
    );
  }
}
export async function POST(request) {
  try {
    await connectTODB();
    const bodyData = await request.json();

    if (!bodyData?.lang) {
      bodyData.lang = 'en';
    }
    
    let data = await ChatList.create(bodyData);
    console.log({data})
    if (!data) {
      return NextResponse.json(
        CommonResponse.error(400, 'Failed to create chat', null)
      );
    }
    data = data.toObject();

    return NextResponse.json(
      CommonResponse.success(201, 'Chat Created!', data)
    );
  } catch (error) {
    return NextResponse.json(
      CommonResponse.error(400, 'Failed to create chat', null)
    );
  }
}