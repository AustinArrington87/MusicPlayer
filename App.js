import React from 'react'
import { StyleSheet, TouchableOpacity, View, ScrollView, Image, Text, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'

const audioBookPlaylist = [
  {
    title: 'Tonic',
    author: 'Bruce Bama',
    source: 'Back to Basics',
    uri:
      'https://archive.org/download/tonic_201909/Tonic.m4a',
    imageSource:
      'https://archive.org/download/bre_20190911_201909/bre.jpg'
  },
  {
    title: 'Hamlet - Act II',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act2_shakespeare.mp3',
    imageSource:
      'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act III',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'http://www.archive.org/download/hamlet_0911_librivox/hamlet_act3_shakespeare.mp3',
    imageSource:
      'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act IV',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act4_shakespeare.mp3',
    imageSource:
      'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  },
  {
    title: 'Hamlet - Act V',
    author: 'William Shakespeare',
    source: 'Librivox',
    uri:
      'https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act5_shakespeare.mp3',
    imageSource:
      'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
  }
]

export default class App extends React.Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    currentIndex: 0,
    volume: 1.0,
    isBuffering: false
  }

async componentDidMount() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true
      })
      this.loadAudio()
    } catch (e) {
      console.log(e)
    }
  }

async loadAudio() {
  const {currentIndex, isPlaying, volume} = this.state
  try {
    const playbackInstance = new Audio.Sound()
    const source = {
      uri: audioBookPlaylist[currentIndex].uri
    }
    const status = {
      shouldPlay: isPlaying,
      volume
    }
    playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
    await playbackInstance.loadAsync(source, status, false)
    this.setState({playbackInstance})
    } catch (e) {
      console.log(e)
    }
}
onPlaybackStatusUpdate = status => {
  this.setState({
    isBuffering: status.isBuffering
  })
}

handlePlayPause = async () => {
  const { isPlaying, playbackInstance } = this.state
  isPlaying
    ? await playbackInstance.pauseAsync()
    : await playbackInstance.playAsync()
  this.setState({
    isPlaying: !isPlaying
  })
}

handlePreviousTrack = async () => {
  let { playbackInstance, currentIndex } = this.state
  if (playbackInstance) {
    await playbackInstance.unloadAsync()
    currentIndex < audioBookPlaylist.length - 1
      ? (currentIndex -= 1)
      : (currentIndex = 0)
    this.setState({
      currentIndex
    })
    this.loadAudio()
  }
}

handleNextTrack = async () => {
  let { playbackInstance, currentIndex } = this.state
  if (playbackInstance) {
    await playbackInstance.unloadAsync()
    currentIndex < audioBookPlaylist.length - 1
      ? (currentIndex += 1)
      : (currentIndex = 0)
    this.setState({
      currentIndex
    })
    this.loadAudio()
  }
}

renderFileInfo() {
    const { playbackInstance, currentIndex } = this.state
    return playbackInstance ? (
      <View style={styles.trackInfo}>
       
        <Text style={[styles.trackInfoText, styles.largeText]}>
          {audioBookPlaylist[currentIndex].title}
        </Text>
        <Text style={[styles.trackInfoText, styles.smallText]}>
          {audioBookPlaylist[currentIndex].author}
        </Text>
        <Text style={[styles.trackInfoText, styles.smallText]}>
          {audioBookPlaylist[currentIndex].source}
        </Text>
      </View>
    ) : null
  }

renderImgInfo() {
    const { playbackInstance, currentIndex } = this.state
    return playbackInstance ? (
      <View>
        <Image
        style={styles.welcomeImage}
        source = {audioBookPlaylist[currentIndex].imageSource}
        />
      </View>
    ) : null
  }

  render() {
    return (
      <View style={styles.container}>  
        <ScrollView
          contentContainerStyle={styles.contentContainer}>
        
    <View style={styles.welcomeContainer}>
        <Image
        style={styles.welcomeImage}
        source={
        require('./assets/img/wiz.png')
        }
        />      
    </View>    

    <View style={styles.getStartedContainer}>
    <Text style={styles.getStartedText}>
        Welcome to SharingWorld! 
      </Text>
    </View>    
        
  <Image
    style={styles.albumCover}
    source={{
      uri: 'https://archive.org/download/bre_20190911_201909/bre.jpg'
    }}
  />

  <View style={styles.controls}>
    <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
      <Ionicons name="ios-skip-backward" size={48} color="#444" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
      {this.state.isPlaying ? (
        <Ionicons name="ios-pause" size={48} color="#444" />
      ) : (
        <Ionicons name="ios-play-circle" size={48} color="#444" />
      )}
    </TouchableOpacity>
    <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
      <Ionicons name="ios-skip-forward" size={48} color="#444" />
    </TouchableOpacity>
  </View>
    {this.renderFileInfo()}
 </ScrollView>

<View style={styles.tabBarInfoContainer}>
    <Text style={styles.tabBarInfoText}>
        Click on Tracks to get started
    </Text>
</View>

</View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  albumCover: {
    width: 250,
    height: 250,
    marginTop: 10
  },
  trackInfo: {
    padding: 1,
    backgroundColor: '#fff'
  },
  trackInfoText: {
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#550088'
  },
  largeText: {
    fontSize: 22
  },
  smallText: {
    fontSize: 16
  },
  control: {
    margin: 20
  },
  controls: {
    flexDirection: 'row'
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop:  3,
    marginLeft: -10  
  },
  contentContainer: {
      paddingTop: 30,
      alignItems: 'center',
      justifyContent: 'center'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20  
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50  
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
        ios:  {
            shadowColor: 'black',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
        },
        android: {
            elevation: 20
        },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20
  },
 tabBarInfoText: {
     fontSize: 17,
     color: 'rgba(96,100,109, 1)',
     textAlign: 'center'
 }    
})
