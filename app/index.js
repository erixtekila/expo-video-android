import { createVideoPlayer, VideoView } from 'expo-video';
import { Component, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoScreen()
{
  const [ mountVideo, setMount ] = useState( false );
  return (
    <View style={ styles.contentContainer }>
      { mountVideo && <MountableVideo /> }
      <View style={ styles.controlsContainer }>
        <Button
          title={ mountVideo ? "Remove video view" : "Add video view" }
          onPress={ () => { setMount( !mountVideo ); } }
        />
      </View>
    </View>
  );
}

function MountableVideo()
{
  // private
  let __player__ = null;
  // hooks
  const [ videoPlayer, setPlayer ] = useState( null );
  const [ isPlaying, setPlaying ] = useState( false );
  useEffect
    (
      () =>
      {
        console.log( "Mount component" );

        __player__ = createVideoPlayer( videoSource );
        console.log( "local player =", __player__.currentTime );//<-- ok
        setPlayer( __player__ );
        const subscription = __player__.addListener
          (
            'playingChange'
            , ( { isPlaying } ) => 
            {
              setPlaying( isPlaying );
              console.log( "isPlaying", isPlaying );
            }
          );
        return () =>
        {
          subscription.remove();
          console.log( "useEffect unmount videoPlayer = ", videoPlayer?.currentTime );// <-- undefined
          console.log( "useEffect unmount closure player = ", __player__.currentTime );// <-- works !
          // FIXME videoPlayer is null before being able to release it !
          // videoPlayer.release();<-- null
          // BTW, This works…!
          console.log( __player__.release );
          __player__.release();
        };
      }, [ /* Runs once */ ]
    );

  useEffect
    (
      () =>
      {
        if ( videoPlayer )
        {
          console.log( "State change videoPlayer" );//<-- ok
          // But, __player__ seems to be void…
          // and accessing videoplayer state methods throws an `java.lang.IllegalStateException` 
          // without being caught by the error boundary !
          for ( let f in videoPlayer )
          {
            try
            {
              console.log( "---", f, videoPlayer[ f ] );
            } catch ( e )
            {
              console.error( e );
            }
          }
        }
      }, [ videoPlayer ]
    );


  return (
    //<ErrorBoundary>
    <>
      <VideoView style={ styles.video } player={ videoPlayer } allowsFullscreen allowsPictureInPicture />
      <Button
        title={ isPlaying ? 'Pause' : 'Play' }
        onPress={ () =>
        {
          if ( isPlaying )
          {
            videoPlayer.pause();
          } else
          {
            videoPlayer.play();
          }
        } }
      />
    </>
    //</ErrorBoundary>
  );
}


class ErrorBoundary extends Component
{
  constructor( props )
  {
    super( props );
    this.state = { hasError: false };
  }

  // This lifecycle method is used to update the state if an error occurs
  static getDerivedStateFromError()
  {
    return { hasError: true };
  }

  // This lifecycle method is used to log the error
  componentDidCatch( error, info ): void
  {
    console.error( 'ErrorBoundary caught an error:', error, info );
  }

  // This render method is specific to React Native
  // just do something in React for a different fallback UI
  render()
  {
    if ( this.state.hasError )
    {
      return (
        <View>
          <Text>Something went wrong.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create( {
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
} );
