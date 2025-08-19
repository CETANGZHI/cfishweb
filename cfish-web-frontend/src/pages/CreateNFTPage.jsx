import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TagInput from '../components/NFT/TagInput';
import { Upload, Image, Music, Video, FileText, CheckCircle, XCircle } from 'lucide-react';

const CreateNFTPage = () => {
  const { t } = useTranslation();
  const [nftData, setNftData] = useState({
    name: '',
    description: '',
    file: null,
    royalty: 5, // Default royalty 5%
    commission: 2, // Default commission 2%
    tags: [],
    attributes: [],
    price: '',
    currency: 'both', // 'sol', 'cfish', 'both'
    listForSale: true,
  });
  const [filePreview, setFilePreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'uploading', 'success', 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNftData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNftData(prev => ({ ...prev, file }));
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleTagsChange = (newTags) => {
    setNftData(prev => ({ ...prev, tags: newTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus('uploading');
    // Simulate API call for NFT creation
    try {
      const response = await fetch("https://api.example.com/nfts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nftData.name,
          description: nftData.description,
          royalty: nftData.royalty,
          commission: nftData.commission, // Ensure commission is sent
          tags: nftData.tags,
          attributes: nftData.attributes,
          price: nftData.price,
          currency: nftData.currency,
          listForSale: nftData.listForSale,
          // file: nftData.file, // File would typically be uploaded separately or as base64
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("NFT created successfully:", result);
      setUploadStatus('success');
      // Reset form after successful upload
      setNftData({
        name: '',
        description: '',
        file: null,
        royalty: 5,
        commission: 2,
        tags: [],
        attributes: [],
        price: '',
        currency: 'both',
        listForSale: true,
      });
      setFilePreview(null);
    } catch (error) {
      console.error('NFT creation failed:', error);
      setUploadStatus('error');
    }
  };

  const getFileTypeIcon = (file) => {
    if (!file) return <FileText size={48} className="text-muted-foreground" />;
    if (file.type.startsWith('image/')) return <Image size={48} className="text-muted-foreground" />;
    if (file.type.startsWith('audio/')) return <Music size={48} className="text-muted-foreground" />;
    if (file.type.startsWith('video/')) return <Video size={48} className="text-muted-foreground" />;
    return <FileText size={48} className="text-muted-foreground" />;
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">{t('createNft.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('createNft.description')}</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: File Upload & Preview */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('createNft.uploadFile')}</h2>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors relative"
              onClick={() => document.getElementById('nftFile').click()}
            >
              {filePreview ? (
                <img src={filePreview} alt="NFT Preview" className="max-h-64 w-full object-contain mx-auto rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center h-48">
                  {getFileTypeIcon(nftData.file)}
                  <p className="mt-4 text-muted-foreground">{t('createNft.dragDrop')}</p>
                  <p className="text-sm text-muted-foreground">{t('createNft.maxSize')}</p>
                </div>
              )}
              <input
                type="file"
                id="nftFile"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,audio/*,video/*"
              />
            </div>
            {nftData.file && (
              <p className="text-sm text-muted-foreground mt-2">{t('createNft.selectedFile')}: {nftData.file.name}</p>
            )}
          </div>

          {/* NFT Attributes (Placeholder) */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('createNft.attributes')}</h2>
            <p className="text-muted-foreground">{t('createNft.attributesDesc')}</p>
            {/* TODO: Implement dynamic attribute input */}
          </div>
        </div>

        {/* Right Column: Details & Settings */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('createNft.details')}</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                {t('createNft.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={nftData.name}
                onChange={handleInputChange}
                placeholder={t('createNft.namePlaceholder')}
                className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                {t('createNft.descriptionLabel')}
              </label>
              <textarea
                id="description"
                name="description"
                value={nftData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder={t('createNft.descriptionPlaceholder')}
                className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
            </div>

            {/* Royalty Setting */}
            <div className="mb-4">
              <label htmlFor="royalty" className="block text-sm font-medium text-foreground mb-2">
                {t('createNft.royalty')}
              </label>
              <input
                type="number"
                id="royalty"
                name="royalty"
                value={nftData.royalty}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('createNft.royaltyDesc')}</p>
            </div>

            {/* Price and Currency Setting */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="listForSale"
                  checked={nftData.listForSale}
                  onChange={(e) => setNftData(prev => ({ ...prev, listForSale: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="listForSale" className="text-sm font-medium text-foreground">
                  {t('createNft.listForSale')}
                </label>
              </div>
              
              {nftData.listForSale && (
                <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border border-border">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                      {t('createNft.price')}
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={nftData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required={nftData.listForSale}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      {t('createNft.acceptedCurrency')}
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="currency-sol"
                          name="currency"
                          value="sol"
                          checked={nftData.currency === 'sol'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <label htmlFor="currency-sol" className="flex items-center text-sm text-foreground">
                          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs mr-2">SOL</span>
                          {t('createNft.solOnly')}
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="currency-cfish"
                          name="currency"
                          value="cfish"
                          checked={nftData.currency === 'cfish'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <label htmlFor="currency-cfish" className="flex items-center text-sm text-foreground">
                          <span className="bg-primary text-black px-2 py-1 rounded text-xs mr-2">CFISH</span>
                          {t('createNft.cfishOnly')}
                          <span className="ml-2 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            {t('createNft.noFees')}
                          </span>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="currency-both"
                          name="currency"
                          value="both"
                          checked={nftData.currency === 'both'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <label htmlFor="currency-both" className="flex items-center text-sm text-foreground">
                          <span className="bg-gradient-to-r from-purple-600 to-primary text-white px-2 py-1 rounded text-xs mr-2">
                            SOL/CFISH
                          </span>
                          {t('createNft.bothCurrencies')}
                          <span className="ml-2 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            {t('createNft.noFeesForCfish')}
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    {/* CFISH优先展示提醒 */}
                    <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-black text-xs font-bold">!</span>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-primary mb-1">
                            💡 {t('createNft.priorityTip')}
                          </p>
                          <p className="text-muted-foreground">
                            {t('createNft.cfishPriorityDescription')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fee Information */}
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                      <h4 className="text-sm font-medium text-foreground mb-2">{t('createNft.feeStructure')}</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>SOL {t('createNft.transactions')}:</span>
                          <span>{nftData.commission}% {t('createNft.platformFee')}</span>
                        </div>
                        <div className="flex justify-between text-green-400">
                          <span>CFISH {t('createNft.transactions')}:</span>
                          <span>{t('createNft.freeTransaction')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('createNft.royalty')}:</span>
                          <span>{nftData.royalty}% {t('createNft.toCreator')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Commission Setting */}
            <div className="mb-4">
              <label htmlFor="commission" className="block text-sm font-medium text-foreground mb-2">
                {t('createNft.commission')}
              </label>
              <input
                type="number"
                id="commission"
                name="commission"
                value={nftData.commission}
                onChange={handleInputChange}
                min="0"
                max="10"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('createNft.commissionDesc')}</p>
            </div>

            {/* Tag Input */}
            <div className="mb-4">
              <TagInput onTagsChange={handleTagsChange} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-primary text-black font-bold py-3 rounded-lg text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2"
            disabled={uploadStatus === 'uploading'}
          >
            {uploadStatus === 'uploading' ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span>
                {t('createNft.uploading')}
              </>
            ) : (
              <>
                <Upload size={20} />
                {t('createNft.createAndList')}
              </>
            )}
          </button>

          {/* Upload Status */}
          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded-lg">
              <CheckCircle size={20} />
              <span>{t('createNft.successMessage')}</span>
            </div>
          )}
          {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg">
              <XCircle size={20} />
              <span>{t('createNft.errorMessage')}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateNFTPage;

