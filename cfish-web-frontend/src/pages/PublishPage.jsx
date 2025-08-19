import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PublishPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 重定向到创建NFT页面
    navigate('/create', { replace: true });
  }, [navigate]);

  return null;
};

export default PublishPage;

