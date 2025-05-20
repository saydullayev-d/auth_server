const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

// Create: Создание новой организации
async function createOrganization(data) {
  try {
    console.log('Создание организации с данными:', data);
    const organization = await prisma.organization.create({
      data: {
        org_name: data.org_name,
        inn: data.inn,
        uniq_key: generateUniqKey(),
        date: data.date ? new Date(data.date) : undefined,
      },
    });
    console.log('Создана организация:', organization);
    return organization;
  } catch (error) {
    throw new Error(`Ошибка создания организации: ${error.message}`);
  }
}

// Read: Получение организации по ID
async function getOrganizationById(id) {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(id) },
    });
    if (!organization) {
      throw new Error('Организация не найдена');
    }
    return organization;
  } catch (error) {
    throw new Error(`Ошибка получения организации: ${error.message}`);
  }
}

// Read: Получение всех организаций
async function getAllOrganizations() {
  try {
    const organizations = await prisma.organization.findMany();
    const total = await prisma.organization.count();
    return {
      data: organizations,
      total,
    };
  } catch (error) {
    throw new Error(`Ошибка получения списка организаций: ${error.message}`);
  }
}

// Update: Обновление организации по ID
async function updateOrganization(id, data) {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(id) },
    });
    if (!organization) {
      throw new Error('Организация не найдена');
    }
    const updatedOrganization = await prisma.organization.update({
      where: { id: parseInt(id) },
      data: {
        org_name: data.org_name !== undefined ? data.org_name : organization.org_name,
        inn: data.inn !== undefined ? data.inn : organization.inn,
        date: data.date !== undefined ? new Date(data.date) : organization.date,
      },
    });
    return updatedOrganization;
  } catch (error) {
    throw new Error(`Ошибка обновления организации: ${error.message}`);
  }
}

// Delete: Удаление организации по ID
async function deleteOrganization(id) {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(id) },
    });
    if (!organization) {
      throw new Error('Организация не найдена');
    }
    await prisma.organization.delete({
      where: { id: parseInt(id) },
    });
    return { message: `Организация с ID ${id} удалена` };
  } catch (error) {
    throw new Error(`Ошибка удаления организации: ${error.message}`);
  }
}

module.exports = {
  createOrganization,
  getOrganizationById,
  getAllOrganizations,
  updateOrganization,
  deleteOrganization,
};