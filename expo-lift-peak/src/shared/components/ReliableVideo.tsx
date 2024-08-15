import React, {forwardRef, memo, useCallback, useEffect, useRef} from 'react';

import { Video } from 'expo-av';
import { VideoProps } from 'expo-av/src/Video.types';

const ReloadableVideo = forwardRef((props: VideoProps, ref) => {
    const [shouldVideoReload, setShouldVideoReload] = React.useState(false);
    const isVideoReadyRef = useRef<boolean>(false);

    const potentiallyReloadVideo = useCallback(() => {
        setTimeout(() => {
            if (!isVideoReadyRef.current) {
                setShouldVideoReload(true);
            }
        }, 300);
    }, []);

    useEffect(() => {
        if (shouldVideoReload) {
            setShouldVideoReload(false);
        }
    }, [shouldVideoReload]);

    return (
        <>
            {!shouldVideoReload && (
                <Video
                    {...props}
                    ref={ref}
                    onLoadStart={() => {
                        potentiallyReloadVideo();
                        if (props.onLoadStart) {
                            props.onLoadStart();
                        }
                    }}
                    onReadyForDisplay={(event) => {
                        isVideoReadyRef.current = true;
                        if (props.onReadyForDisplay) {
                            props.onReadyForDisplay(event);
                        }
                    }}
                />
            )}
        </>
    );
})

export default memo(ReloadableVideo);
