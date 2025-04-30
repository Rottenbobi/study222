<template>
  <div class="chat-page">
    <div class="chat-layout">
      <!-- 侧边栏改为功能介绍 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <img :src="isDeepThinking ? '/juex.png' : '/fx.jpg'" alt="AI" class="ai-logo">
            <div class="logo-text">
              知著侠
              <div class="status-badge">
                <i class="fas fa-circle"></i> 在线
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar-content">
          <div class="ai-status">
            <div class="status-item">
              <div class="status-label">心境</div>
              <div class="status-value">
                <i :class="['fas', isDeepThinking ? 'fa-brain' : 'fa-lightbulb']"></i> 
                {{ isDeepThinking ? '已觉醒' : '未觉醒' }}
              </div>
            </div>
            <div class="status-item">
              <div class="status-label">当前议题</div>
              <div class="status-value">
                <i class="fas fa-comment-dots"></i>
                {{ currentTopic || '静候主公' }}
              </div>
            </div>
            <div class="status-item">
              <div class="status-label">回答速度</div>
              <div class="status-value">
                <i class="fas fa-tachometer-alt"></i>
                {{ typingSpeed === 50 ? '从容' : '疾速' }}
              </div>
            </div>
          </div>
          
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-chess"></i>
              </div>
              <div class="feature-content">
                <h3>谋略相助</h3>
                <p>运筹帷幄，决胜千里，为主公解忧</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-book-open"></i>
              </div>
              <div class="feature-content">
                <h3>智囊相询</h3>
                <p>博古通今，学贯中西，答疑解惑</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <i class="fas fa-code"></i>
              </div>
              <div class="feature-content">
                <h3>技艺相授</h3>
                <p>世间技艺，奉孝皆通</p>
              </div>
            </div>
          </div>

          <div class="personality-card">
            <h3>个性特点</h3>
            <div class="personality-tags">
              <div class="tag"><i class="fas fa-bolt"></i>机智</div>
              <div class="tag"><i class="fas fa-book"></i>博学</div>
              <div class="tag"><i class="fas fa-brain"></i>睿智</div>
              <div class="tag"><i class="fas fa-heart"></i>忠诚</div>
              <div class="tag"><i class="fas fa-chess-knight"></i>谋略</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主聊天区域 -->
      <div class="main-content">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="header-info">
            <h2>知著侠</h2>
            <div class="typing-indicator" v-if="isTyping">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="header-actions">
            <a-button 
              class="action-button" 
              :type="isDeepThinking ? 'primary' : 'outline'"
              @click="toggleThinkingMode"
            >
              <i :class="['fas', isDeepThinking ? 'fa-brain' : 'fa-feather']"></i>
              {{ isDeepThinking ? '已觉醒' : '未觉醒' }}
            </a-button>
            
            <a-button 
              class="action-button" 
              :type="typingSpeed === 30 ? 'primary' : 'outline'"
              @click="adjustSpeed"
            >
              <i class="fas fa-tachometer-alt"></i>
              {{ typingSpeed === 50 ? '慢速回答' : '快速回答' }}
            </a-button>
            
            <a-button 
              class="action-button danger-button" 
              @click="clearChat"
            >
              <i class="fas fa-trash-alt"></i>
              清空对话
            </a-button>
          </div>
        </div>

        <!-- 聊天消息区域 -->
        <div class="chat-container" ref="chatContainer">
          <div class="welcome-screen" v-if="messages.length === 0">
            <div class="welcome-icon">
              <img :src="isDeepThinking ? '/juex.png' : '/sgj.jpg'" alt="AI" class="welcome-avatar">
              <!-- 欢迎页头像上方消息气泡 -->
              <div class="welcome-message" v-if="showingAvatarMessage">
                {{ avatarMessage }}
              </div>
              <div class="poker-cards" v-if="showPokerAnimation">
                <div v-for="(card, index) in pokerCards" :key="index" class="poker-card" :class="{'red-suit': card === '♥' || card === '♦'}">
                  {{ card }}
                </div>
              </div>
              <div class="poker-comment" v-if="showPokerComment">
                {{ pokerComment }}
              </div>
            </div>
            <h1>奉孝在此，主公复有何忧？</h1>
            <p>无论是谋略相商、技艺相授，还是闲话家常，奉孝必当竭诚相助。</p>
            <div class="quick-starts">
              <div class="quick-start-section">
                <h3>常问话题</h3>
                <div class="suggestion-chips">
                  <a-button class="suggestion" 
                           v-for="(suggestion, index) in commonTopics" 
                           :key="index" 
                           @click="useExample(suggestion)">
                    {{ suggestion }}
                  </a-button>
                </div>
              </div>

            </div>
          </div>

          <template v-else>
            <div v-for="(message, index) in messages" 
                 :key="index" 
                 :class="['message-wrapper', message.role]">
              <div class="message-container">
                <div class="avatar">
                  <img :src="message.role === 'assistant' ? (isDeepThinking ? '/juex.png' : '/fx.jpg') : '/wx.jpg'" 
                       :alt="message.role">
                </div>
                <div class="message-content">
                  <div class="message-text" :class="{ 'typing': message.role === 'assistant' && index === messages.length - 1 && isTyping }">
                    <template v-if="message.role === 'assistant' && index === messages.length - 1 && isTyping">
                      {{ typingText }}<span class="typing-cursor">|</span>
                    </template>
                    <template v-else>
                      <span v-html="formatPokerMessage(message.content)"></span>
                    </template>
                  </div>
                  <div class="message-actions" v-if="message.role === 'assistant'">
                    <a-button type="text" size="small" @click="copyMessage(message.content)">
                      <i class="fas fa-copy"></i>
                    </a-button>
                    <a-button type="text" size="small" @click="readMessage(message.content)">
                      <i class="fas fa-volume-up"></i>
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-if="error" class="message-wrapper system">
            <div class="message-container">
              <div class="message-content error">
                {{ error }}
              </div>
            </div>
          </div>
          
          <!-- 打断按钮 -->
          <div class="interrupt-container" v-if="isTyping">
            <a-button type="primary" danger class="action-button interrupt-button" @click="interruptOutput">
              <i class="fas fa-hand-paper"></i> 打断回答
            </a-button>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-section">
          <div class="input-container">
            <textarea
              v-model="userInput"
              placeholder="请问主公有何见教..."
              @keydown.enter.prevent="handleSend"
              :disabled="loading"
              class="message-input"
              rows="1"
              ref="inputRef"
              @input="autoResize"
            ></textarea>
            <div class="input-actions">
              <a-tooltip title="呈上图文">
                <a-button class="action-btn" :disabled="loading">
                  <i class="fas fa-scroll"></i>
                </a-button>
              </a-tooltip>
              <a-button 
                type="primary" 
                class="send-button"
                @click="handleSend" 
                :loading="loading"
              >
                <template v-if="!loading">
                  <i class="fas fa-feather-alt"></i>
                </template>
                <template v-else>
                  推演中...
                </template>
              </a-button>
            </div>
          </div>
          <div class="input-footer">
            <span class="footer-text">由 DeepSeek 技法驱动</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { message } from 'ant-design-vue';
import type { ChatMessage } from '../services/deepseek';
import deepseekService from '../services/deepseek';

const messages = ref<ChatMessage[]>([]);
const userInput = ref('');
const loading = ref(false);
const error = ref('');
const chatContainer = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);
const isTyping = ref(false);
const typingText = ref('');
const typingSpeed = ref(50);
const currentTopic = ref('');
const isDeepThinking = ref(false);

// 扑克牌花色相关
const pokerCards = ref<string[]>([]);
const showPokerAnimation = ref(true);
const pokerInterval = ref<number | null>(null);
const cardGenerationInterval = ref<number | null>(null);
const pokerComment = ref('');
const showPokerComment = ref(false);

// 思考中的花色数组和定时器
const thinkingPokerSuits = ref<string[]>([]);
const thinkingInterval = ref<number | null>(null);

// 常见话题建议
const commonTopics = [
  "奉孝可有何能？",
  "为主公讲个典故",
  "论当今天下大势",
  "对天下形势有何见解"
];

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const autoResize = () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
    inputRef.value.style.height = inputRef.value.scrollHeight + 'px';
  }
};

const typeMessage = async (text: string) => {
  isTyping.value = true;
  typingText.value = '';
  
  // 根据是否开启深度思考模式调整打字速度
  const currentTypingSpeed = isDeepThinking.value ? typingSpeed.value * 1.5 : typingSpeed.value;
  
  for (let i = 0; i < text.length; i++) {
    // 如果被打断，提前退出
    if (!isTyping.value) break;
    
    typingText.value += text[i];
    await scrollToBottom();
    await new Promise(resolve => setTimeout(resolve, currentTypingSpeed));
  }
  
  isTyping.value = false;
  return typingText.value;
};

const copyMessage = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制到剪贴板');
  });
};

// 添加语音控制函数
const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

const clearChat = () => {
  if (messages.value.length > 0) {
    // 停止当前语音播放
    stopSpeaking();
    showAvatarMessage('对话已清空');
    messages.value = [];
    currentTopic.value = '';
    error.value = '';
  }
};

// 组件卸载时清理语音
onUnmounted(() => {
  stopSpeaking();
  
  // 清除扑克牌动画定时器
  if (pokerInterval.value) {
    clearInterval(pokerInterval.value);
    pokerInterval.value = null;
  }
  
  if (cardGenerationInterval.value) {
    clearInterval(cardGenerationInterval.value);
    cardGenerationInterval.value = null;
  }
  
  // 清除思考动画定时器
  if (thinkingInterval.value) {
    clearInterval(thinkingInterval.value);
    thinkingInterval.value = null;
  }
  
  // 移除字体图标
  const link = document.querySelector('link[href*="font-awesome"]');
  if (link) {
    link.remove();
  }
});

// 监听路由变化
const handleRouteChange = () => {
  stopSpeaking();
};

const readMessage = (text: string) => {
  // 先停止之前的语音
  stopSpeaking();
  
  const speech = new SpeechSynthesisUtterance(text);
  
  // 配置语音参数
  speech.lang = 'zh-CN'; // 设置语言为中文
  speech.rate = 0.9;     // 语速稍慢，显得更稳重
  speech.pitch = 0.9;    // 音调略低，显得更成熟
  speech.volume = 1.0;   // 音量适中
  
  // 选择合适的声音
  window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    // 优先使用中文男声
    const chineseVoice = voices.find(voice => 
      voice.lang.includes('zh') && voice.name.includes('Male')
    );
    if (chineseVoice) {
      speech.voice = chineseVoice;
    }
  };

  // 添加语音结束事件处理
  speech.onend = () => {
    console.log('语音播放结束');
  };

  speech.onerror = (event) => {
    console.error('语音播放错误:', event);
    message.error('奉孝朗读遇到了些许困难');
  };
  
  // 开始播放
  window.speechSynthesis.speak(speech);
  
  // 添加语音状态提示
  message.success('奉孝正在为主公诵读');
};

const adjustSpeed = () => {
  if (typingSpeed.value === 50) {
    typingSpeed.value = 30;
    showAvatarMessage('已切换为疾速思考');
  } else {
    typingSpeed.value = 50;
    showAvatarMessage('已切换为从容思考');
  }
};

// 思考中的扑克牌生成
const getThinkingPokerMessage = () => {
  return `聪以知远，明以察微 ${thinkingPokerSuits.value.join(' ')}...`;
};

// 开始生成思考中的扑克牌
const startThinkingPokerAnimation = () => {
  // 先清空之前的花色
  thinkingPokerSuits.value = [];
  
  // 清除之前的定时器
  if (thinkingInterval.value) {
    clearInterval(thinkingInterval.value);
  }
  
  // 每隔0.8秒添加一个花色
  thinkingInterval.value = window.setInterval(() => {
    const suits = ['♠', '♥', '♦', '♣'];
    const newSuit = suits[Math.floor(Math.random() * suits.length)];
    thinkingPokerSuits.value.push(newSuit);
    
    // 检查是否有重复花色
    if (hasDuplicateSuit(thinkingPokerSuits.value)) {
      // 停止添加
      if (thinkingInterval.value) {
        clearInterval(thinkingInterval.value);
        thinkingInterval.value = null;
      }
    }
    
    // 最多不超过6个花色
    if (thinkingPokerSuits.value.length >= 6) {
      if (thinkingInterval.value) {
        clearInterval(thinkingInterval.value);
        thinkingInterval.value = null;
      }
    }
  }, 800);
};

const handleSend = async () => {
  const input = userInput.value.trim();
  if (!input || loading.value) {
    return;
  }
  
  // 如果当前正在输出，先打断
  if (isTyping.value) {
    interruptOutput();
    // 给一个短暂的延迟，让打断操作完成
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  error.value = '';
  currentTopic.value = input.length > 20 ? input.slice(0, 20) + '...' : input;
  
  const userMessage: ChatMessage = {
    role: 'user',
    content: input
  };
  
  messages.value.push(userMessage);
  
  // 开始思考动画
  thinkingPokerSuits.value = [];
  startThinkingPokerAnimation();
  
  // 首先添加一个初始思考消息
  const initialThinkingMessage: ChatMessage = {
    role: 'assistant',
    content: `聪以知远，明以察微...`
  };
  messages.value.push(initialThinkingMessage);
  
  // 设置思考消息更新定时器
  const thinkingUpdateInterval = window.setInterval(() => {
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'assistant') {
      messages.value[messages.value.length - 1].content = getThinkingPokerMessage();
      scrollToBottom();
    }
  }, 100);
  
  const currentInput = userInput.value;
  userInput.value = '';
  loading.value = true;
  
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
  }
  
  try {
    const response = await deepseekService.sendMessage(messages.value.slice(0, -1)); // 不发送思考中的消息
    
    // 停止思考动画
    if (thinkingInterval.value) {
      clearInterval(thinkingInterval.value);
      thinkingInterval.value = null;
    }
    
    // 停止思考消息更新
    clearInterval(thinkingUpdateInterval);
    
    if (response && response.content) {
      // 替换思考中的消息
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: ''
      };
      messages.value[messages.value.length - 1] = assistantMessage;
      
      const finalText = await typeMessage(response.content);
      assistantMessage.content = finalText;
    } else {
      throw new Error('无效的响应格式');
    }
  } catch (err: any) {
    // 停止思考动画
    if (thinkingInterval.value) {
      clearInterval(thinkingInterval.value);
      thinkingInterval.value = null;
    }
    
    // 停止思考消息更新
    clearInterval(thinkingUpdateInterval);
    
    console.error('发送消息失败:', err);
    error.value = err.message || '发送消息失败，请重试';
    message.error(error.value);
    userInput.value = currentInput;
    messages.value.pop(); // 移除思考中的消息
    messages.value.pop(); // 移除用户消息
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
};

const useExample = (text: string) => {
  userInput.value = text;
  handleSend();
};

// 获取扑克牌图标
const getPokerIcon = (card: string) => {
  switch(card) {
    case '♠': return 'fa-spade'; // 黑桃
    case '♥': return 'fa-heart'; // 红心
    case '♦': return 'fa-gem'; // 方块，使用gem图标替代
    case '♣': return 'fa-club'; // 梅花
    default: return 'fa-question';
  }
};

// 生成随机扑克牌花色
const generateRandomPokerSuit = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  return suits[Math.floor(Math.random() * suits.length)];
};

// 检查是否有两个相同的花色
const hasDuplicateSuit = (cards: string[]) => {
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i] === cards[j]) {
        return true;
      }
    }
  }
  return false;
};

// 生成扑克牌注释
const generatePokerComment = (cards: string[]) => {
  if (cards.length === 2 && hasDuplicateSuit(cards)) {
    return '又是二郭头了...星号狗卡！';
  } else if (cards.length >= 5) {
    return '奉孝不才，一轮十牌！';
  }
  return '';
};

// 开始扑克牌动画
const startPokerAnimation = () => {
  // 清除之前的定时器
  if (pokerInterval.value) {
    clearInterval(pokerInterval.value);
    pokerInterval.value = null;
  }
  
  if (cardGenerationInterval.value) {
    clearInterval(cardGenerationInterval.value);
    cardGenerationInterval.value = null;
  }
  
  // 清空牌组和评论
  pokerCards.value = [];
  pokerComment.value = '';
  showPokerComment.value = false;
  showPokerAnimation.value = true;
  
  // 每隔一秒添加一张牌，不设上限
  cardGenerationInterval.value = window.setInterval(() => {
    const newCard = generateRandomPokerSuit();
    pokerCards.value.push(newCard);
    
    // 检查是否有两个相同的花色
    if (hasDuplicateSuit(pokerCards.value)) {
      // 停止添加新牌
      if (cardGenerationInterval.value) {
        clearInterval(cardGenerationInterval.value);
        cardGenerationInterval.value = null;
      }
      
      // 生成注释并显示
      pokerComment.value = generatePokerComment(pokerCards.value);
      if (pokerComment.value) {
        showPokerComment.value = true;
        // 3秒后隐藏注释
        setTimeout(() => {
          showPokerComment.value = false;
        }, 3000);
      }
      
      // 3秒后重新开始
      setTimeout(() => {
        if (messages.value.length === 0) {
          startPokerAnimation();
        }
      }, 3000);
    }
  }, 1000);
};

// 监听消息变化，当有消息时停止动画
watch(messages, (newValue) => {
  if (newValue.length > 0) {
    showPokerAnimation.value = false;
    if (pokerInterval.value) {
      clearInterval(pokerInterval.value);
      pokerInterval.value = null;
    }
  } else {
    showPokerAnimation.value = true;
    startPokerAnimation();
  }
}, { deep: true });

// 格式化聊天消息，给扑克花色添加颜色
const formatPokerMessage = (text: string) => {
  if (!text) return '';
  
  // 替换扑克花色为带颜色的版本
  return text
    .replace(/♥/g, '<span class="red-suit">♥</span>')
    .replace(/♦/g, '<span class="red-suit">♦</span>')
    .replace(/♠/g, '<span class="black-suit">♠</span>')
    .replace(/♣/g, '<span class="black-suit">♣</span>');
};

// 切换思考模式
const toggleThinkingMode = () => {
  isDeepThinking.value = !isDeepThinking.value;
  const mode = isDeepThinking.value ? '已觉醒' : '未觉醒';
  
  // 显示对应台词
  if (isDeepThinking.value) {
    showAvatarMessage('纵殒身祭命，亦要助明公大业');
  } else {
    showAvatarMessage('未及引动天能，竟已要坠入轮回');
  }
};

// 添加头像消息显示函数和状态
const avatarMessage = ref('');
const showingAvatarMessage = ref(false);

const showAvatarMessage = (text) => {
  avatarMessage.value = text;
  showingAvatarMessage.value = true;
  
  // 3秒后隐藏消息
  setTimeout(() => {
    showingAvatarMessage.value = false;
  }, 3000);
};

// 打断AI输出
const interruptOutput = () => {
  if (isTyping.value) {
    isTyping.value = false;
    message.success('已打断当前回答');
    // 确保回答内容保留到当前打字进度
    if (messages.value.length > 0) {
      const lastMessage = messages.value[messages.value.length - 1];
      if (lastMessage.role === 'assistant') {
        lastMessage.content = typingText.value + ' [回答已打断]';
      }
    }
  }
};

onMounted(async () => {
  // 加载字体图标
  const link = document.createElement('link');
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  // 添加路由变化监听
  window.addEventListener('popstate', handleRouteChange);
  
  // 开始扑克牌动画
  startPokerAnimation();
  
  // 显示初始欢迎信息（根据当前状态显示对应台词）
  setTimeout(() => {
    if (isDeepThinking.value) {
      showAvatarMessage('纵殒身祭命，亦要助明公大业');
    } else {
      showAvatarMessage('未及引动天能，竟已要坠入轮回');
    }
  }, 1000);
});
</script>

<style scoped lang="scss">
.chat-page {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(to bottom right, #f7f3eb, #e8e1d5);
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.chat-layout {
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
}

.sidebar {
  width: 300px;
  background: rgba(44, 38, 35, 0.95);
  color: #e8e1d5;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(232, 225, 213, 0.2);
  
  .sidebar-header {
    padding: 20px 24px;
    background: rgba(44, 38, 35, 0.98);
    border-bottom: 1px solid rgba(232, 225, 213, 0.1);
    flex-shrink: 0;
    position: relative;
    
    .logo {
      display: flex;
      align-items: center;
      gap: 14px;
      
      .ai-logo {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        object-fit: cover;
        border: 2px solid rgba(212, 180, 131, 0.4);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        transition: all 0.3s;
        
        &:hover {
          border-color: #d4b483;
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }
      }
      
      .logo-text {
        font-size: 22px;
        font-weight: 600;
        color: #fff;
        display: flex;
        flex-direction: column;
        gap: 6px;
        
        .status-badge {
          font-size: 12px;
          color: #d4b483;
          background: rgba(212, 180, 131, 0.15);
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: normal;
          display: flex;
          align-items: center;
          gap: 5px;
          width: fit-content;
          
          i {
            font-size: 8px;
            color: #10b981;
            animation: pulse 2s infinite;
          }
        }
      }
    }
  }
  
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(44, 38, 35, 0.5);
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(212, 180, 131, 0.3);
      border-radius: 3px;
      
      &:hover {
        background: rgba(212, 180, 131, 0.5);
      }
    }
  }
}

.ai-status {
  background: rgba(232, 225, 213, 0.08);
  border: 1px solid rgba(232, 225, 213, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .status-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .status-label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      
      &::before {
        content: '';
        width: 4px;
        height: 4px;
        background: #d4b483;
        border-radius: 50%;
        display: block;
      }
    }
    
    .status-value {
      font-size: 15px;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      
      i {
        color: #d4b483;
        font-size: 14px;
        width: 16px;
        text-align: center;
      }
      
      &.deep-thinking {
        color: #a78bfa;
        font-weight: bold;
      }
    }
  }
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .feature-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    background: rgba(232, 225, 213, 0.08);
    border: 1px solid rgba(232, 225, 213, 0.1);
    transition: all 0.25s;

    &:hover {
      background: rgba(212, 180, 131, 0.1);
      border-color: rgba(212, 180, 131, 0.3);
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: rgba(212, 180, 131, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      i {
        font-size: 20px;
        color: #d4b483;
      }
    }

    .feature-content {
      h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 8px;
        color: #fff;
      }

      p {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.5;
        margin: 0;
      }
    }
  }
}

.personality-card {
  background: rgba(232, 225, 213, 0.08);
  border: 1px solid rgba(232, 225, 213, 0.1);
  border-radius: 12px;
  padding: 16px 20px;
  
  h3 {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 16px;
    position: relative;
    padding-left: 12px;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 16px;
      background: #d4b483;
      border-radius: 2px;
    }
  }
  
  .personality-tags {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    .tag {
      background: rgba(212, 180, 131, 0.1);
      color: #d4b483;
      border: 1px solid rgba(212, 180, 131, 0.3);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.25s;
      
      i {
        font-size: 12px;
        opacity: 0.9;
      }
      
      &:hover {
        background: rgba(212, 180, 131, 0.15);
        border-color: #d4b483;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.chat-header {
  padding: 20px 32px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  
  h2 {
    margin: 0;
    font-size: 20px;
    color: #111827;
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    
    .action-button {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      height: 36px;
      transition: all 0.2s;
      border-radius: 18px;
      
      i {
        font-size: 14px;
      }
      
      &:hover {
        transform: translateY(-1px);
      }
      
      &.danger-button {
        border-color: #f87171;
        color: #ef4444;
        
        &:hover {
          background-color: #fef2f2;
        }
      }
    }
  }
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  background: transparent;
  
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(232, 225, 213, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(212, 180, 131, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(212, 180, 131, 0.5);
    }
  }
  
  .welcome-screen {
    text-align: center;
    padding: 64px 32px;
    max-width: 600px;
    margin: 0 auto;
    
    .welcome-icon {
      font-size: 64px;
      margin-bottom: 32px;
      animation: float 3s ease-in-out infinite;
      position: relative;
      
      .welcome-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #d4b483;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        transition: all 0.3s;
        
        &:hover {
          transform: scale(1.05);
          border-color: #2c2623;
        }
      }
      
      .welcome-message {
        position: absolute;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.9);
        color: #2c2623;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        animation: fadeInDown 0.5s ease-out;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid rgba(255, 255, 255, 0.9);
        }
      }
      
      .poker-cards {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        max-width: 200px;
        
        .poker-card {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50; // 默认黑色
          
          &.red-suit {
            color: #e74c3c; // 红色花色
          }
          
          &:nth-child(4n+1) {
            transform: rotate(-15deg);
          }
          
          &:nth-child(4n+2) {
            transform: rotate(-5deg);
          }
          
          &:nth-child(4n+3) {
            transform: rotate(5deg);
          }
          
          &:nth-child(4n+4) {
            transform: rotate(15deg);
          }
        }
      }
      
      .poker-comment {
        position: absolute;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.9);
        color: #2c2623;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        animation: fadeInDown 0.5s ease-out;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid rgba(255, 255, 255, 0.9);
        }
      }
    }
    
    h1 {
      font-size: 36px;
      margin-bottom: 20px;
      color: #111827;
      font-weight: 600;
      background: linear-gradient(120deg, #2c2623, #d4b483);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    p {
      color: #6b7280;
      margin-bottom: 40px;
      font-size: 16px;
      line-height: 1.6;
    }
    
    .quick-starts {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 32px;
      
      .quick-start-section {
        h3 {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 12px;
        }
      }
    }
  }
}

.message-wrapper {
  margin-bottom: 32px;
  transition: all 0.3s;

  &.assistant {
    background: rgba(255, 253, 250, 0.9);
    border: 1px solid rgba(212, 180, 131, 0.2);
    box-shadow: 0 4px 12px rgba(44, 38, 35, 0.05);
    border-radius: 16px;
  }

  &.user {
    background: rgba(44, 38, 35, 0.03);
    border: 1px solid rgba(44, 38, 35, 0.1);
    border-radius: 16px;
  }

  .message-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    gap: 20px;
    
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 2px solid rgba(212, 180, 131, 0.3);
      transition: all 0.3s;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      &:hover {
        transform: scale(1.05);
        border-color: #d4b483;
      }
    }

    .message-content {
      flex: 1;
      
      .message-text {
        font-size: 15px;
        line-height: 1.8;
        letter-spacing: 0.02em;
        white-space: pre-wrap;
        color: #2c2623;
        
        :deep(.red-suit) {
          color: #e74c3c;
          font-weight: bold;
        }
        
        :deep(.black-suit) {
          color: #2c3e50;
          font-weight: bold;
        }
        
        .typing-cursor {
          display: inline-block;
          width: 3px;
          height: 1.2em;
          background: #d4b483;
          animation: blink 1s infinite;
          margin-left: 4px;
          vertical-align: middle;
          border-radius: 1px;
        }
      }
      
      &.error {
        color: #dc2626;
        background: #fee2e2;
        padding: 16px;
        border-radius: 12px;
        margin-top: 12px;
        border: 1px solid rgba(220, 38, 38, 0.2);
      }
      
      .message-actions {
        margin-top: 8px;
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.3s;
        
        .ant-btn {
          color: #6b7280;
          
          &:hover {
            color: #3b82f6;
          }
        }
      }
      
      &:hover .message-actions {
        opacity: 1;
      }
    }
  }
}

.input-section {
  padding: 24px 32px 32px;
  background: rgba(255, 253, 250, 0.95);
  border-top: 1px solid rgba(44, 38, 35, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.9), transparent);
    pointer-events: none;
  }

  .input-container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    gap: 16px;
    background: rgba(255, 253, 250, 0.95);
    border: 1px solid rgba(212, 180, 131, 0.3);
    border-radius: 16px;
    padding: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;

    &:focus-within {
      border-color: #d4b483;
      box-shadow: 0 4px 20px rgba(212, 180, 131, 0.15);
    }

    .message-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 12px;
      resize: none;
      max-height: 200px;
      font-size: 15px;
      line-height: 1.5;
      color: #2c2623;
      letter-spacing: 0.02em;
      
      &::placeholder {
        color: rgba(44, 38, 35, 0.5);
      }
      
      &:disabled {
        background: #f9fafb;
      }
    }

    .input-actions {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      
      .action-btn {
        color: #6b7280;
        
        &:hover {
          color: #3b82f6;
        }
      }
    }

    .send-button {
      align-self: flex-end;
      border-radius: 12px;
      height: 44px;
      width: 44px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      
      i {
        font-size: 18px;
      }

      &:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
      }
    }
  }

  .input-footer {
    max-width: 900px;
    margin: 12px auto 0;
    text-align: center;
    
    .footer-text {
      color: #6b7280;
      font-size: 13px;
      opacity: 0.8;
    }
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

@keyframes brushStroke {
  0% {
    transform: scale(0.95) translateY(2px);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes message-popup {
  from {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .sidebar {
    width: 280px;
    
    .sidebar-header {
      padding: 16px 20px;
    }
    
    .sidebar-content {
      padding: 20px;
    }
    
    .features-list {
      gap: 16px;
      
      .feature-item {
        padding: 12px;
      }
    }
  }
  
  .message-container {
    padding: 20px;
  }
  
  .input-section {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .chat-container {
    padding: 20px;
  }
  
  .message-container {
    padding: 16px;
  }
  
  .input-section {
    padding: 16px;
    
    .input-container {
      padding: 8px;
      
      .message-input {
        padding: 8px;
      }
      
      .send-button {
        height: 40px;
        width: 40px;
      }
    }
  }
  
  .welcome-screen {
    padding: 32px 20px;
    
    h1 {
      font-size: 28px;
    }
    
    .welcome-icon {
      font-size: 48px;
    }
  }
  
  .chat-header {
    padding: 12px 16px;
    
    .header-actions {
      gap: 8px;
      
      .action-button {
        padding: 0 10px;
        font-size: 12px;
        
        i {
          font-size: 12px;
        }
      }
    }
  }
  
  // 在移动端添加简单的功能提示
  .chat-container {
    .welcome-screen {
      .feature-hints {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
        justify-content: center;
        
        .feature-hint {
          background: rgba(255, 255, 255, 0.8);
          padding: 12px;
          border-radius: 12px;
          text-align: center;
          flex: 1;
          min-width: 140px;
          max-width: 200px;
          
          i {
            font-size: 24px;
            color: #3b82f6;
            margin-bottom: 8px;
          }
          
          h4 {
            margin: 0 0 4px;
            color: #1f2937;
          }
          
          p {
            margin: 0;
            font-size: 12px;
            color: #6b7280;
          }
        }
      }
    }
  }
}

.interrupt-container {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  justify-content: center;
  animation: slideUp 0.3s ease-out;
  
  .interrupt-button {
    font-size: 15px;
    padding: 6px 20px;
    height: 40px;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3);
    }
    
    i {
      margin-right: 6px;
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style> 