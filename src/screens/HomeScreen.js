import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {
  FlatList,
  Platform,
  Modal,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useVoiceInput from '../hooks/useVoiceInput';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import ImageCropPicker from 'react-native-image-crop-picker';

const fullFeed = [
  {
    id: 1,
    type: 'text',
    title: 'Welcome to Google Clone!',
    description: 'Start your search with voice or image.',
  },
  {
    id: 2,
    type: 'image',
    image:
      'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?fit=crop&w=800&q=80',
    caption: 'Explore the world through Google Lens',
  },
  {
    id: 3,
    type: 'text',
    title: 'AI Voice Search',
    description: 'Tap the mic to speak your query aloud.',
  },
  {
    id: 4,
    type: 'image',
    image:
      'https://images.unsplash.com/photo-1557683316-973673baf926?fit=crop&w=800&q=80',
    caption: 'Instant image crop and upload',
  },
  {
    id: 5,
    type: 'text',
    title: 'Multi-Modal Search',
    description: 'Combine voice, text, and image for better results.',
  },
  {
    id: 6,
    type: 'image',
    image:
      'https://images.pexels.com/photos/3100802/pexels-photo-3100802.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Photo-based queries made smarter',
  },
  {
    id: 7,
    type: 'text',
    title: 'React Native Tutorials',
    description: 'Build beautiful mobile apps in JavaScript.',
  },
  {
    id: 8,
    type: 'image',
    image:
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    caption: 'Learn cross-platform mobile development',
  },
  {
    id: 9,
    type: 'text',
    title: 'Machine Learning in Search',
    description: 'AI powers the ranking of your results.',
  },
  {
    id: 10,
    type: 'image',
    image:
      'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?fit=crop&w=800&q=80',
    caption: 'Visualize data and results with clarity',
  },
];

const HomeScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [filteredFeed, setFilteredFeed] = useState(fullFeed);
  const [showImageOption, setShowImageOption] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const {
    voiceText,
    isListening,
    startListening,
    stopListening,
    resetVoiceInput,
  } = useVoiceInput();

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening) animateDots();
  }, [isListening]);

  useEffect(() => {
    if (voiceText) {
      setSearch(voiceText);
      filterFeed(voiceText);
      stopListening();
      setShowVoiceModal(false);
      resetVoiceInput();
    }
  }, [voiceText]);

  const animateDots = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const filterFeed = text => {
    const lowerText = text.toLowerCase();
    const filtered = fullFeed.filter(item => {
      if (item.type === 'text') {
        return (
          item.title.toLowerCase().includes(lowerText) ||
          item.description.toLowerCase().includes(lowerText)
        );
      } else if (item.type === 'image') {
        return item.caption.toLowerCase().includes(lowerText);
      }
      return false;
    });
    setFilteredFeed(filtered);
  };

  const handleSearchChange = text => {
    setSearch(text);
    filterFeed(text);
  };

  const handleMicPress = () => {
    setSearch('');
    setShowVoiceModal(true);
    resetVoiceInput();
    startListening();
  };

  const requestPermission = async type => {
    const permission =
      Platform.OS === 'ios'
        ? type === 'camera'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.IOS.PHOTO_LIBRARY
        : type === 'camera'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    const result = await check(permission);
    if (result !== RESULTS.GRANTED) {
      await request(permission);
    }
  };

  const handleImageOption = async source => {
    setShowImageOption(false);
    await requestPermission(source);

    const pickerOptions = {
      width: 300,
      height: 400,
      cropping: true,
    };

    try {
      const image =
        source === 'camera'
          ? await ImageCropPicker.openCamera(pickerOptions)
          : await ImageCropPicker.openPicker(pickerOptions);

      if (image) {
        navigation.navigate('ImageResults', {image});
      }
    } catch (err) {
      console.warn('Image selection cancelled or failed:', err.message);
    }
  };

  return (
    <Container>
      <Title>Google</Title>

      <SearchBar>
        <Ionicons name="search" size={18} color="#888" />
        <StyledInput
          placeholder="Search or type URL"
          value={search}
          onChangeText={handleSearchChange}
          placeholderTextColor="#aaa"
        />
        <Ionicons
          name={isListening ? 'mic' : 'mic-outline'}
          size={20}
          color={isListening ? 'red' : '#1a73e8'}
          style={{padding: '10'}}
          onPress={handleMicPress}
        />
        <MaterialIcons
          name="camera-alt"
          size={20}
          color="green"
          onPress={() => setShowImageOption(true)}
        />
      </SearchBar>

      <ShortcutRow>
        {['Search', 'Translate', 'Image', 'Homework'].map(item => (
          <Shortcut key={item}>
            <ShortcutText>{item}</ShortcutText>
          </Shortcut>
        ))}
      </ShortcutRow>

      <FlatList
        data={filteredFeed}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          if (item.type === 'text') {
            return (
              <Card>
                <CardTitle>{item.title}</CardTitle>
                <CardText>{item.description}</CardText>
              </Card>
            );
          } else if (item.type === 'image') {
            return (
              <ImageCard>
                <FeedImage source={{uri: item.image}} />
                <ImageCaption>{item.caption}</ImageCaption>
              </ImageCard>
            );
          }
          return null;
        }}
      />

      {/* Voice Modal */}
      <Modal visible={showVoiceModal} transparent animationType="fade">
        <VoiceOverlay>
          <Text style={{color: '#fff', fontSize: 20, marginBottom: 20}}>
            Speak now
          </Text>
          <DotRow>
            {['#4285F4', '#EA4335', '#FBBC05', '#34A853'].map(
              (color, index) => (
                <AnimatedDot
                  key={index}
                  style={{
                    backgroundColor: color,
                    transform: [{scale: animation}],
                  }}
                />
              ),
            )}
          </DotRow>
          <TouchableOpacity
            style={{marginTop: 30}}
            onPress={() => {
              setShowVoiceModal(false);
              stopListening();
              resetVoiceInput();
            }}>
            <Text style={{color: '#fff', fontSize: 16}}>Cancel</Text>
          </TouchableOpacity>
        </VoiceOverlay>
      </Modal>

      {/* Image Source Modal */}
      <Modal
        visible={showImageOption}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageOption(false)}>
        <TouchableWithoutFeedback onPress={() => setShowImageOption(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 12,
                width: 250,
              }}>
              <Text
                style={{fontWeight: 'bold', fontSize: 16, marginBottom: 12}}>
                Choose Image Source
              </Text>
              <TouchableOpacity
                onPress={() => handleImageOption('camera')}
                style={{marginBottom: 12}}>
                <Text style={{fontSize: 16}}>📷 Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleImageOption('gallery')}>
                <Text style={{fontSize: 16}}>🖼️ Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Container>
  );
};

export default HomeScreen;

const ImageCard = styled.View`
  background-color: #000;
  border-radius: 14px;
  margin-bottom: 15px;
  overflow: hidden;
`;

const FeedImage = styled.Image`
  width: 100%;
  height: 200px;
`;

const ImageCaption = styled.Text`
  color: #fff;
  padding: 10px;
  font-size: 14px;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #1e1e1e;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 36px;
  color: #4d90fe;
  font-weight: bold;
  align-self: center;
`;

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #2a2a2a;
  padding: 10px 15px;
  border-radius: 20px;
  margin-top: 10px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  color: #fff;
  margin-left: 10px;
`;

const ShortcutRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 20px 0;
`;

const Shortcut = styled.TouchableOpacity`
  background-color: #2f2f2f;
  padding: 10px 12px;
  border-radius: 16px;
`;

const ShortcutText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

const Card = styled.View`
  background-color: #2f2f2f;
  padding: 15px;
  border-radius: 14px;
  margin-bottom: 15px;
`;

const CardTitle = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #fff;
`;

const CardText = styled.Text`
  color: #aaa;
  margin-top: 5px;
`;

const VoiceOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

const DotRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`;

const AnimatedDot = styled(Animated.View)`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin: 0 4px;
`;
