// src/components/AvatarSelector.jsx
import React, { useState } from 'react';

const AvatarSelector = ({ onAvatarSelect }) => {
  const avatars = [
    'https://static.vecteezy.com/system/resources/previews/017/398/762/non_2x/3d-render-illustration-of-cute-male-avatar-icon-wearing-typical-chinese-hat-chinese-new-year-png.png',
    'https://static.vecteezy.com/system/resources/previews/017/398/763/non_2x/3d-render-cute-chinese-woman-avatar-icon-illustration-chinese-new-year-png.png',
    'https://static.vecteezy.com/system/resources/thumbnails/017/398/774/small/3d-rendering-cute-rabbit-avatar-icon-illustration-year-of-the-rabbit-chinese-new-year-png.png',
    'https://static.vecteezy.com/system/resources/thumbnails/017/398/768/small/3d-render-illustration-of-cute-male-avatar-icon-wearing-typical-chinese-hat-chinese-new-year-png.png',
    'https://i.ibb.co/Q9YXzrq/image-removebg-preview.png',
    'https://i.ibb.co/2NKxLR8/cutenino.png',
  ];

  const [selectedAvatar, setSelectedAvatar] = useState('');

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar);
    onAvatarSelect(avatar); // Notifica al componente padre el avatar seleccionado
  };

  return (
    <div className="flex flex-wrap gap-4">
      {avatars.map((avatar) => (
        <img
          key={avatar}
          src={avatar}
          alt="avatar"
          onClick={() => handleSelect(avatar)}
          className={`cursor-pointer w-20 h-20 rounded-full border-4 ${
            selectedAvatar === avatar ? 'border-green-500' : 'border-gray-500'
          }`}
        />
      ))}
    </div>
  );
};

export default AvatarSelector;