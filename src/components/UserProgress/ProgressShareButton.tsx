import { useAuth } from '../../hooks/use-auth';
import { useCopyText } from '../../hooks/use-copy-text';
import type { ResourceType } from '../../lib/resource-progress';
import { CheckIcon } from '../ReactIcons/CheckIcon';
import { ShareIcon } from '../ReactIcons/ShareIcon';
import { isLoggedIn } from '../../lib/jwt';
import { cn } from '../../lib/classname';

type ProgressShareButtonProps = {
  resourceId: string;
  resourceType: ResourceType;
  className?: string;
  shareIconClassName?: string;
  checkIconClassName?: string;
  canShare?: boolean;
  shareUrl?: string;
};
export function ProgressShareButton(props: ProgressShareButtonProps) {
  const {
    resourceId,
    resourceType,
    className,
    shareIconClassName,
    checkIconClassName,
    canShare,
    shareUrl,
  } = props;

  const user = useAuth();
  const { copyText, isCopied } = useCopyText();

  function handleCopyLink() {
    if (shareUrl) {
      copyText(shareUrl);
      return;
    }
    const isDev = import.meta.env.DEV;
    const newUrl = new URL(
      isDev ? 'http://localhost:3000' : 'https://roadmap.sh'
    );

    if (resourceType === 'roadmap') {
      newUrl.pathname = `/${resourceId}`;
    } else {
      newUrl.pathname = `/best-practices/${resourceId}`;
    }

    newUrl.searchParams.set('s', user?.id || '');
    copyText(newUrl.toString());
  }

  if (!user) {
    return null;
  }

  return (
    <button
      className={cn(
        'flex items-center gap-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70',
        isCopied ? 'text-green-500' : 'text-gray-500 hover:text-black',
        className
      )}
      onClick={handleCopyLink}
      disabled={!canShare}
    >
      {isCopied ? (
        <>
          <CheckIcon additionalClasses={`h-3.5 w-3.5 ${checkIconClassName}`} />{' '}
          Link Copied
        </>
      ) : (
        <>
          <ShareIcon
            className={`h-3.5 w-3.5 stroke-[2.5px] ${shareIconClassName}`}
          />{' '}
          Share Progress
        </>
      )}
    </button>
  );
}