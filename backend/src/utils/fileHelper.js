const { cloudinary } = require('../config/cloudinary');

exports.deleteFile = async (url) => {
  if (!url) return;
  
  try {
    const publicId = url.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`car-management/${publicId}`);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};