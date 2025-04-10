import React, { useState } from 'react'
import { ShareIcon, CheckIcon } from '@heroicons/react/24/outline'
import { generateShareableLink, copyToClipboard } from '../utils/share'
import { ComparisonResult } from '../types'

interface ShareButtonProps {
  prompt: string
  results: ComparisonResult[]
}

const ShareButton: React.FC<ShareButtonProps> = ({ prompt, results }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = async () => {
    const shareableLink = generateShareableLink(prompt, results)
    const success = await copyToClipboard(shareableLink)
    
    if (success) {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="btn btn-secondary inline-flex items-center"
    >
      {isCopied ? (
        <>
          <CheckIcon className="h-5 w-5 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <ShareIcon className="h-5 w-5 mr-2" />
          Share
        </>
      )}
    </button>
  )
}

export default ShareButton 