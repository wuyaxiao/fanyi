import { XMLParser } from 'fast-xml-parser';
import gradient from 'gradient-string';
import fetch from 'node-fetch';
import OpenAI from 'openai';
import ora from 'ora';
import { printIciba } from './lib/iciba.mjs';

const gradients = [
  'cristal',
  'teen',
  'mind',
  'morning',
  'vice',
  'passion',
  'fruit',
  'instagram',
  'atlas',
  'retro',
  'summer',
  'pastel',
  'rainbow',
];

export default async (word, options) => {
  console.log('');
  const { iciba, deepseek, codegeex,LLM_API_KEY,codegeex_api_key } = options;
  const endcodedWord = encodeURIComponent(word);

  // iciba
  if (isTrueOrUndefined(iciba)) {
    const ICIBA_URL =
      'https://dict-co.iciba.com/api/dictionary.php?key=D191EBD014295E913574E1EAF8E06666&w=';
    const spinner = ora('正在请教 iciba...').start();
    try {
      const response = await fetch(`${ICIBA_URL}${endcodedWord}`);
      const xml = await response.text();
      const parser = new XMLParser();
      const result = parser.parse(xml);
      spinner.stop();
      printIciba(result.dict, options);
    } catch (error) {
      spinner.fail('访问 iciba 失败，请检查网络');
    }
  }

  // deepseek
  if (isTrueOrUndefined(deepseek)) {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: LLM_API_KEY || 'sk-a6325c2f3d2044968e6a83f249cc1541',
    });

    const model = 'deepseek-chat';

    const spinner = ora(`正在请教 ${model}...`).start();
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `
你是一本专业的中英文双语词典。请按照以下要求提供翻译和解释：

1. 格式要求：
   [原词] [音标] ~ [翻译] [拼音] ~ [EMOJI]
   
   - [词性] [释义1]
   - [词性] [释义2]
   ...

   例句：
   1. [原文例句]
      [翻译]
   2. [原文例句]
      [翻译]
   ...

  [EMOJI] [座右铭]
   -----

2. 翻译规则：
   - 英文输入翻译为中文，中文输入翻译为英文
   - 提供准确的音标（英文）或拼音（中文）
   - 列出所有常见词性及其对应的释义
   - 释义应简洁明了，涵盖词语的主要含义，使用中文
   - 提供2-3个地道的例句，体现词语的不同用法和语境

3. 内容质量：
   - 确保翻译和释义的准确性和权威性
   - 例句应当实用、常见，并能体现词语的典型用法
   - 注意词语的语体色彩，如正式、口语、书面语等
   - 对于多义词，按照使用频率由高到低排列释义

4. 特殊情况：
   - 对于习语、谚语或特殊表达，提供对应的解释和等效表达
   - 注明词语的使用范围，如地域、行业特定用语等
   - 对于缩写词，提供完整形式和解释

5. 格式中的 [EMOJI] 指的是一个 emoji 表情符号，请根据词性、释义、例句等选择合适的表情符号。

请基于以上要求，为用户提供简洁、专业、全面且易于理解的词语翻译和解释。

---
最后使用这个词写一句简短的积极向上令人深思的英文座右铭，并提供中文翻译。但回复中不要包含"座右铭"三个字
`,
          },
          {
            role: 'user',
            content: `请翻译：${word}`,
          },
        ],
        model,
        temperature: 1.3,
      });
      spinner.stop();
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
      console.log(gradient[randomGradient](chatCompletion.choices[0].message.content));
    } catch (error) {
      spinner.fail(`访问 ${model} 失败，请检查网络或 API 密钥`);
    }
  }

    // codegeex
  if (isTrueOrUndefined(codegeex)) {
    const openai = new OpenAI({
      baseURL: "https://open.bigmodel.cn/api/paas/v4", // 确保 baseURL 正确
      apiKey: codegeex_api_key, // 检查 API Key 是否有效
    });
  
    const model = 'glm-4'; // 尝试使用 'glm-4' 或 'glm-4-flash'，取决于 API 支持
  
    const spinner = ora(`正在请求 ${model}...`).start();
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
                    {
            role: 'system',
            content: `
你是一本专业的中英文双语词典。请按照以下要求提供翻译和解释：

1. 格式要求：
   [原词] [音标] ~ [翻译] [拼音] ~ [EMOJI]
   
   - [词性] [释义1]
   - [词性] [释义2]
   ...

   例句：
   1. [原文例句]
      [翻译]
   2. [原文例句]
      [翻译]
   ...

  [EMOJI] [座右铭]
   -----

2. 翻译规则：
   - 英文输入翻译为中文，中文输入翻译为英文
   - 提供准确的音标（英文）或拼音（中文）
   - 列出所有常见词性及其对应的释义
   - 释义应简洁明了，涵盖词语的主要含义，使用中文
   - 提供2-3个地道的例句，体现词语的不同用法和语境

3. 内容质量：
   - 确保翻译和释义的准确性和权威性
   - 例句应当实用、常见，并能体现词语的典型用法
   - 注意词语的语体色彩，如正式、口语、书面语等
   - 对于多义词，按照使用频率由高到低排列释义

4. 特殊情况：
   - 对于习语、谚语或特殊表达，提供对应的解释和等效表达
   - 注明词语的使用范围，如地域、行业特定用语等
   - 对于缩写词，提供完整形式和解释

5. 格式中的 [EMOJI] 指的是一个 emoji 表情符号，请根据词性、释义、例句等选择合适的表情符号。

请基于以上要求，为用户提供简洁、专业、全面且易于理解的词语翻译和解释。

---
最后使用这个词写一句简短的积极向上令人深思的英文座右铭，并提供中文翻译。但回复中不要包含"座右铭"三个字
`,
          },
          {
            role: 'user',
            content: `请翻译：${word}`, // 测试简单输入
          },
        ],
        model, // 确保模型名称正确
      });
      spinner.succeed('请求成功');
      console.log(chatCompletion.choices[0].message.content);
    } catch (error) {
      spinner.fail('请求失败');
      console.error('错误详情:', error.message);
      if (error.response) {
        console.error('HTTP 状态码:', error.response.status);
        console.error('API 返回数据:', error.response.data);
      }
    }
  }
};

function isTrueOrUndefined(val) {
  return val === true || val === undefined;
}
