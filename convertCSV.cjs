// Скрипт для конвертации CSV с реальными ссылками в JSON формат
const fs = require('fs');

const INPUT_FILE = './data.csv'; // Ваш CSV файл
const OUTPUT_FILE = './src/data/mockData.ts';

// App Store категории (как в FilterPanel)
const appStoreCategories = {
  'Fitness': 'saas',
  'Nutrition & Diet': 'saas',
  'Mental Health': 'saas',
  'Self-Improvement': 'saas',
  'Astrology & Spirituality': 'social',
  'Health': 'saas',
  'Language Learning': 'saas',
  'Relations & Dating': 'social',
  'Location & Utilities': 'saas',
  'Parenting': 'saas',
  'Beauty & Style': 'saas',
  'AI & Technology': 'social',
  'Hobbies & Lifestyle': 'saas',
  'E-commerce': 'ecommerce',
  'Income & Finance': 'fintech',
  'Education': 'saas',
  'Religion': 'social',
  'IQ & Brain Games': 'saas',
  'Entertainment': 'media',
  'Other': 'saas'
};

// Точный маппинг вертикалей в App Store категории
const verticalToCategory = {
  // Fitness
  'Fitness': 'Fitness',
  
  // Nutrition & Diet
  'Nutrition and diet': 'Nutrition & Diet',
  
  // Mental Health
  'Mental, ADHD, Habits, Trauma': 'Mental Health',
  
  // Self-Improvement
  'Self-improvement, microlearning': 'Self-Improvement',
  
  // Astrology & Spirituality
  'Astrology, Human Design, Compatibility': 'Astrology & Spirituality',
  
  // Health
  'Health': 'Health',
  'Men/Women health': 'Health',
  
  // Language Learning
  'Language Learning': 'Language Learning',
  
  // Relations & Dating
  'Relations, Dating': 'Relations & Dating',
  
  // Location & Utilities
  'Geo location, utilities': 'Location & Utilities',
  
  // Parenting
  'Parenting': 'Parenting',
  
  // Beauty & Style
  'Beauty': 'Beauty & Style',
  'Style': 'Beauty & Style',
  
  // AI & Technology
  'AI characters': 'AI & Technology',
  
  // Hobbies & Lifestyle
  'Hobbies': 'Hobbies & Lifestyle',
  
  // E-commerce
  'Physical goods, ecommerce': 'E-commerce',
  
  // Income & Finance
  'Income': 'Income & Finance',
  
  // Education
  'Edtech': 'Education',
  
  // Religion
  'Religion': 'Religion',
  
  // IQ & Brain Games
  'IQ test': 'IQ & Brain Games',
  
  // Entertainment
  'Stories and novels': 'Entertainment',
  'Photo Video': 'Entertainment',
  
  // Services
  'Services': 'Other'
};

// Функция для определения App Store категории
function mapToAppStoreCategory(vertical, serviceName) {
  if (!vertical) return 'Other';
  
  // Сначала проверяем точное совпадение
  if (verticalToCategory[vertical]) {
    return verticalToCategory[vertical];
  }
  
  // Если точного совпадения нет, анализируем содержимое
  const v = vertical.toLowerCase();
  const s = serviceName.toLowerCase();
  
  // Fitness
  if (v.includes('fitness') || s.includes('fit') || s.includes('workout') || s.includes('exercise')) {
    return 'Fitness';
  }
  
  // Nutrition & Diet
  if (v.includes('nutrition') || v.includes('diet') || v.includes('fasting') || v.includes('keto') ||
      s.includes('diet') || s.includes('fast') || s.includes('nutrition')) {
    return 'Nutrition & Diet';
  }
  
  // Mental Health
  if (v.includes('mental') || v.includes('adhd') || v.includes('habits') || v.includes('trauma') ||
      s.includes('mind') || s.includes('brain') || s.includes('mental')) {
    return 'Mental Health';
  }
  
  // Self-Improvement
  if (v.includes('self-improvement') || v.includes('microlearning') ||
      s.includes('improvement') || s.includes('learn')) {
    return 'Self-Improvement';
  }
  
  // Astrology & Spirituality
  if (v.includes('astrology') || v.includes('human design') || v.includes('compatibility') ||
      s.includes('astro') || s.includes('spiritual')) {
    return 'Astrology & Spirituality';
  }
  
  // Health
  if (v.includes('health') || s.includes('health') || s.includes('yoga') || s.includes('pilates')) {
    return 'Health';
  }
  
  // Language Learning
  if (v.includes('language learning') || s.includes('language') || s.includes('speak')) {
    return 'Language Learning';
  }
  
  // Relations & Dating
  if (v.includes('dating') || v.includes('relations') || s.includes('dating') || s.includes('relations')) {
    return 'Relations & Dating';
  }
  
  // Location & Utilities
  if (v.includes('geo location') || v.includes('utilities') || s.includes('geo') || s.includes('location')) {
    return 'Location & Utilities';
  }
  
  // Parenting
  if (v.includes('parenting') || s.includes('parent') || s.includes('baby') || s.includes('child')) {
    return 'Parenting';
  }
  
  // Beauty & Style
  if (v.includes('beauty') || v.includes('style') || s.includes('beauty') || s.includes('style')) {
    return 'Beauty & Style';
  }
  
  // AI & Technology
  if (v.includes('ai characters') || s.includes('ai') || s.includes('chat')) {
    return 'AI & Technology';
  }
  
  // Hobbies & Lifestyle
  if (v.includes('hobbies') || s.includes('hobby') || s.includes('lifestyle')) {
    return 'Hobbies & Lifestyle';
  }
  
  // E-commerce
  if (v.includes('physical goods') || v.includes('ecommerce') || s.includes('shop') || s.includes('store')) {
    return 'E-commerce';
  }
  
  // Income & Finance
  if (v.includes('income') || s.includes('income') || s.includes('money') || s.includes('earn')) {
    return 'Income & Finance';
  }
  
  // Education
  if (v.includes('edtech') || s.includes('edu') || s.includes('school')) {
    return 'Education';
  }
  
  // Religion
  if (v.includes('religion') || s.includes('religion') || s.includes('bible')) {
    return 'Religion';
  }
  
  // IQ & Brain Games
  if (v.includes('iq test') || s.includes('iq') || s.includes('brain')) {
    return 'IQ & Brain Games';
  }
  
  // Entertainment
  if (v.includes('stories') || v.includes('novels') || s.includes('story') || s.includes('entertainment')) {
    return 'Entertainment';
  }
  
  // Если ничего не подходит
  return 'Other';
}

// Функция для определения типа воронки
function getTypeFromCategory(category) {
  if (category === 'Relations & Dating' || category === 'AI & Technology' || 
      category === 'Astrology & Spirituality' || category === 'Religion') return 'signup';
  if (category === 'Fitness' || category === 'Health' || category === 'Nutrition & Diet') return 'onboarding';
  if (category === 'Education' || category === 'Language Learning' || category === 'Parenting') return 'onboarding';
  if (category === 'E-commerce') return 'checkout';
  if (category === 'Income & Finance') return 'subscription';
  if (category === 'Mental Health' || category === 'Self-Improvement' || category === 'IQ & Brain Games') return 'onboarding';
  if (category === 'Beauty & Style' || category === 'Hobbies & Lifestyle') return 'onboarding';
  if (category === 'Entertainment') return 'onboarding';
  if (category === 'Location & Utilities') return 'onboarding';
  return 'onboarding';
}

// Функция для извлечения тегов из CSV категории
function extractTagsFromVertical(vertical) {
  if (!vertical) return [];
  
  const tags = vertical.toLowerCase()
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 3); // Максимум 3 тега
  return tags;
}

// Функция для генерации аналитики
function generateAnalytics() {
  const visitors = [
    '1.2M MAU', '2.5M MAU', '890K MAU', '3.1M MAU', 
    '1.8M MAU', '4.8M MAU', '780K MAU', '1.9M MAU',
    '650K MAU', '2.1M MAU', '1.5M MAU', '3.8M MAU',
    '420K MAU', '5.2M MAU', '1.1M MAU', '2.8M MAU'
  ];
  
  const dynamics = [
    '+15%', '+22%', '+8%', '+28%', '+12%', '+19%', 
    '-3%', '-8%', '+31%', '+5%', '+45%', '+18%',
    '+35%', '-12%', '+7%', '+41%', '+26%', '-5%'
  ];
  
  return {
    visitors: visitors[Math.floor(Math.random() * visitors.length)],
    dynamics: dynamics[Math.floor(Math.random() * dynamics.length)]
  };
}

// Функция для парсинга CSV
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  return lines.slice(2).map(line => { // Пропускаем заголовки и пустую строку
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    return {
      Service: values[0] || '',
      Category: values[1] || '',
      Funnel_URL: values[2] || ''
    };
  }).filter(row => row.Service && row.Category);
}

// Основная функция конвертации
function convertData() {
  try {
    const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
    const csvData = parseCSV(rawData);
    
    console.log(`🔄 Обрабатываем ${csvData.length} записей с новыми App Store категориями...`);
    
    // Статистика по категориям
    const categoryStats = {};
    const verticalStats = {};
    
    const convertedData = csvData.map((item, index) => {
      const id = (index + 1).toString();
      const brand = item.Service || `Brand ${id}`;
      const csvCategory = item.Category || '';
      const url = item.Funnel_URL || '';
      
      // Определяем App Store категорию
      const appStoreCategory = mapToAppStoreCategory(csvCategory, brand);
      const industry = appStoreCategories[appStoreCategory] || 'saas';
      
      // CSV категория становится тегами
      const tags = extractTagsFromVertical(csvCategory);
      
      // Статистика
      if (!categoryStats[appStoreCategory]) {
        categoryStats[appStoreCategory] = 0;
      }
      categoryStats[appStoreCategory]++;
      
      if (!verticalStats[csvCategory]) {
        verticalStats[csvCategory] = 0;
      }
      verticalStats[csvCategory]++;
      
      console.log(`📝 ${brand}: ${appStoreCategory} | CSV: ${csvCategory} | Tags: ${tags.join(', ')}`);
      
      return {
        id,
        title: `${brand} Onboarding Flow`,
        company: brand,
        description: `${csvCategory} solution with innovative approach`,
        industry,
        category: appStoreCategory,
        type: getTypeFromCategory(appStoreCategory),
        tags,
        thumbnail: `https://picsum.photos/400/300?random=${id}`,
        createdAt: new Date().toISOString().split('T')[0],
        addedToLibrary: new Date().toISOString().split('T')[0],
        analytics: generateAnalytics(),
        appStoreUrl: url || `https://apps.apple.com/app/${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        metaAdsUrl: `https://facebook.com/business/${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}-ads`,
        valueProposition: `${csvCategory} solution with innovative approach and seamless user experience designed for modern users`,
        steps: [
          { id: `${id}-1`, title: 'Welcome', screenshot: `https://picsum.photos/800/600?random=${id}1` },
          { id: `${id}-2`, title: 'Profile Setup', screenshot: `https://picsum.photos/800/600?random=${id}2` },
          { id: `${id}-3`, title: 'Getting Started', screenshot: `https://picsum.photos/800/600?random=${id}3` },
          { id: `${id}-4`, title: 'Complete Setup', screenshot: `https://picsum.photos/800/600?random=${id}4` },
        ]
      };
    });
    
    // Генерируем TypeScript файл
    const tsContent = `import { Funnel } from '../types';

export const mockFunnels: Funnel[] = ${JSON.stringify(convertedData, null, 2)};
`;
    
    fs.writeFileSync(OUTPUT_FILE, tsContent);
    
    console.log(`\n✅ Успешно конвертировано ${convertedData.length} записей!`);
    console.log(`📁 Результат сохранен в: ${OUTPUT_FILE}`);
    console.log(`📊 Размер данных: ${(tsContent.length / 1024).toFixed(1)} KB`);
    
    // Статистика по App Store категориям
    console.log(`\n📈 Распределение по новым App Store категориям:`);
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} сервисов`);
      });
    
    // Статистика по CSV вертикалям
    console.log(`\n🔍 Топ-20 CSV вертикалей:`);
    Object.entries(verticalStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .forEach(([vertical, count]) => {
        const category = mapToAppStoreCategory(vertical, '');
        console.log(`   ${vertical} → ${category}: ${count} сервисов`);
      });
    
    // Статистика по ссылкам
    const urlsFound = convertedData.filter(item => csvData.find(src => src.Service === item.company)?.Funnel_URL).length;
    console.log(`🔗 Реальные ссылки: ${urlsFound}/${convertedData.length}`);
    
  } catch (error) {
    console.error('❌ Ошибка при конвертации:', error.message);
  }
}

convertData(); 