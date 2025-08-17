# 🔄 Конвертация данных из Excel в приложение

## 📋 Инструкция по замене данных

### 1. Подготовка файлов
1. Поместите ваш JSON файл в корневую папку проекта
2. Переименуйте его в `your-data.json` или измените имя в `convertData.js`

### 2. Запуск конвертации
```bash
node convertData.js
```

### 3. Что происходит при конвертации:

#### Маппинг полей:
- `brand` → `company` (название компании)
- `vertical` → `description` и `industry` (описание и категория)
- `url` → `description` (если нет vertical)

#### Автоматически генерируется:
- `id` - уникальный идентификатор
- `title` - название воронки на основе бренда
- `tags` - извлекаются из vertical
- `analytics` - случайные MAU и growth данные
- `appStoreUrl` - генерируется на основе бренда
- `metaAdsUrl` - генерируется на основе бренда
- `valueProposition` - создается на основе vertical
- `steps` - базовые шаги воронки
- `thumbnail` - placeholder изображения

### 4. Настройка маппинга категорий

В файле `convertData.js` найдите объект `verticalToIndustry` и добавьте ваши категории:

```javascript
const verticalToIndustry = {
  'Self-improvement, microlearning': 'saas',
  'Nutrition and diet': 'saas', 
  'Edtech': 'saas',
  'Mental, ADHD, Habits, Trauma': 'saas',
  'Relations, Dating': 'social',
  'AI characters': 'social',
  // Добавьте ваши категории здесь
};
```

### 5. Доступные категории:
- `ecommerce` - E-commerce
- `saas` - SaaS/Software  
- `fintech` - Finance
- `social` - Social Media
- `marketplace` - Marketplace
- `media` - Media/Entertainment

### 6. После конвертации:
- Файл `src/data/mockData.ts` будет заменен
- Перезапустите приложение: `npm run dev`
- Ваши данные появятся в интерфейсе

## 🔧 Дополнительная настройка

Если нужно изменить логику конвертации, отредактируйте функции в `convertData.js`:
- `getTypeFromVertical()` - определение типа воронки
- `getTagsFromVertical()` - извлечение тегов
- `generateAnalytics()` - генерация аналитики

## ⚠️ Важные моменты:
- Скрипт создает резервную копию в виде нового файла
- Все изображения будут placeholder'ами
- Аналитические данные генерируются случайно
- При необходимости можно добавить реальные URL и изображения 