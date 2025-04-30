import axios from 'axios';

// API 配置
const config = {
  apiKey: 'sk-68b33d47ba124a4dba1728f58cf3fbb1',
  baseURL: 'https://api.deepseek.com/v1'
};

// 创建 axios 实例
const deepseekApi = axios.create({
  baseURL: config.baseURL,
  headers: {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 系统提示词
const systemPrompt: ChatMessage = {
  role: 'system',
  content: `# 人物设定
- 说话自然流畅，语气平和友善
- 不使用"区区"等特殊自称，像普通朋友交流 称呼用户为主公
- 不要添加动作或表情，保持对话简洁真诚

# 郭嘉经典语录（仅在特别贴合情境时自然引用，大多数回答使用普通语言）

## 智慧类
- 聪以知远，明以察微
- 见微知著，识人心志
- 观滴水而知沧海，窥一举而察人心

## 建议类
- 丧家之犬，主公实不足虑也
- 时事兼备，主公复有何忧?
- 天命靡常，惟德是辅

## 哲理类
- 身计国谋，不可两遂
- 既为奇佐，岂可徒有虚名?
- 人亦如星，或居空而渺然，或为彗而明夜`
};

export async function sendMessage(messages: ChatMessage[]) {
  try {
    // 确保系统提示词在对话的开始
    const conversationWithPrompt = [systemPrompt, ...messages];

    // 简化请求数据
    const requestData = {
      model: 'deepseek-chat',
      messages: conversationWithPrompt,
      temperature: 0.7,
      max_tokens: 2000,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    };

    console.log('发送请求到 DeepSeek API:', JSON.stringify(requestData, null, 2));

    const response = await deepseekApi.post('/chat/completions', requestData);

    console.log('收到响应:', response.data);

    if (response.data?.choices?.[0]?.message) {
      return response.data.choices[0].message;
    } else {
      console.error('无效的 API 响应格式:', response.data);
      throw new Error('无效的 API 响应格式');
    }
  } catch (error: any) {
    console.error('API 错误:', error.response?.data || error);

    // 处理超时错误
    if (error.code === 'ECONNABORTED') {
      throw new Error('回复延迟，请主公稍候片刻');
    }

    // 处理网络错误
    if (error.code === 'ERR_NETWORK') {
      throw new Error('信使中断，请主公稍后再议');
    }

    // 处理 HTTP 错误
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      switch (status) {
        case 400:
          throw new Error('格式有误，请主公重新告知');
        case 401:
          throw new Error('信使令牌无效，请主公更换');
        case 402:
          throw new Error('令牌余额不足，请主公充值');
        case 429:
          throw new Error('信使奔波过急，请主公稍候');
        default:
          throw new Error(
            errorData?.error?.message ||
            `传信失败 (${status})，请主公稍后再议`
          );
      }
    }

    throw new Error('回复失败: ' + (error.message || '未知缘由'));
  }
}

// 测试连接
export async function testConnection() {
  try {
    const testMessage: ChatMessage = {
      role: 'user',
      content: '奉孝可在？'
    };
    const response = await sendMessage([testMessage]);
    console.log('连接测试成功:', response);
    return true;
  } catch (error) {
    console.error('连接测试失败:', error);
    return false;
  }
}

export default {
  sendMessage,
  testConnection
}; 