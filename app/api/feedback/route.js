import { NextResponse } from 'next/server';

import { connectTODB } from '../../../lib/conn';
import { CommonResponse } from '../../../lib/server/func';
import FeedBacks from '../../models/FeedBack.model';
export async function GET(request) {
  try {
    await connectTODB();

    // Get the URL and parse query parameters
    const { searchParams } = new URL(request.url);
    let pageNum = parseInt(searchParams.get('page')) || 1;
    let limitNum = parseInt(searchParams.get('limit')) || 10;
    let lang = searchParams.get('lang') || '';

    const skip = (pageNum - 1) * limitNum;

    // Fetch feedbacks with pagination
    const data = await FeedBacks.find({ lang: lang.trim() })
      .skip(skip)
      .limit(limitNum)
      .sort('-createdAt')
      .lean();
    const totalCount = await FeedBacks.countDocuments({ lang: lang.trim() });

    const paginate = {
      totalCount: totalCount,
      totalPage: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      currentLimit: limitNum,
      hasNextPage: data.length === limitNum,
    };

    // Include pagination data in the response
    return NextResponse.json(
      CommonResponse.success(200, 'Feedback fetch!', data, paginate)
    );
  } catch (error) {
    return NextResponse.json(
      CommonResponse.error(400, 'Failed to fetch feedback', null)
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

    let data = await FeedBacks.create(bodyData);
    if (!data) {
      return NextResponse.json(
        CommonResponse.error(400, 'Failed to send feedback', null)
      );
    }
    data = data.toObject();

    const supportedLanguage = [
      {
        lang: 'en',
        title: 'Thank You!',
        description: 'Your feedback has been successfully submitted.',
      },
      {
        lang: 'ar',
        title: 'شكراً لك!',
        description: 'تم إرسال ملاحظاتك بنجاح.',
      },
      {
        lang: 'bn',
        title: 'ধন্যবাদ!',
        description: 'আপনার মতামত সফলভাবে জমা দেওয়া হয়েছে।',
      },
      {
        lang: 'ud',
        title: 'شکریہ!',
        description: 'آپ کا فیڈبیک کامیابی کے ساتھ جمع کر دیا گیا ہے۔',
      },
      {
        lang: 'bm',
        title: 'Terima Kasih!',
        description: 'Maklum balas anda telah berjaya dihantar.',
      },
    ];

    data.langMessage = supportedLanguage.find((item) => {
      return item?.lang == data?.lang;
    });

    return NextResponse.json(
      CommonResponse.success(201, 'Feedback Created!', data)
    );
  } catch (error) {
    return NextResponse.json(
      CommonResponse.error(400, 'Failed to create feedback', null)
    );
  }
}
