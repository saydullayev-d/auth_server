const { DataTypes } = require('sequelize');
   const sequelize = require('../db');

   // Функция для генерации uniq_key
   function generateUniqKey() {
     const now = new Date();
     const year = now.getFullYear().toString();
     const month = (now.getMonth() + 1).toString().padStart(2, '0');
     const day = now.getDate().toString().padStart(2, '0');
     const hours = now.getHours().toString().padStart(2, '0');
     const minutes = now.getMinutes().toString().padStart(2, '0');
     const seconds = now.getSeconds().toString().padStart(2, '0');

     // Формируем строку YYYYMMDDHHMMSS и переворачиваем
     const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;
     const reversedDateTime = dateTimeString.split('').reverse().join('');

     // Добавляем случайный 4-символьный суффикс для уникальности
     const randomSuffix = Math.random().toString(36).substring(2, 6);
     return reversedDateTime + randomSuffix;
   }

   const Organization = sequelize.define('Organization', {
     id: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true,
       allowNull: false,
     },
     org_name: {
       type: DataTypes.STRING(255),
       allowNull: true,
     },
     inn: {
       type: DataTypes.STRING(200),
       allowNull: true,
     },
     uniq_key: {
       type: DataTypes.STRING(200),
       allowNull: true, // Временно для отладки
       unique: true,
     },
     date: {
       type: DataTypes.DATE,
       allowNull: true,
       defaultValue: DataTypes.NOW,
     },
   }, {
     tableName: 'organizations',
     timestamps: false,
     schema: 'public',
     hooks: {
       beforeCreate: (organization, options) => {
         console.log('Хук beforeCreate вызван:', organization.toJSON());
         organization.uniq_key = generateUniqKey();
         console.log('Сгенерирован uniq_key:', organization.uniq_key);
       },
     },
   });

   module.exports = Organization;