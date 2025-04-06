import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const mockProductResults = Array.from({length: 10}, (_, i) => ({
  id: i + 1,
  image:
    i % 2 === 0
      ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1533236897111-3e94666b2edf?fit=crop&w=800&q=80',
  title: `Stylish Top ${i + 1}`,
  source: i % 2 === 0 ? 'Amazon' : 'Myntra',
  price: `₹${599 + i * 60}`,
}));

const ImageResultsScreen = ({route, navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (route?.params?.image?.path) {
      const img = route.params.image.path;
      setSelectedImage(img);
      setResults(mockProductResults);
    }
  }, [route]);

  const handleCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({cropping: true});
      setSelectedImage(image.path);
      setResults(mockProductResults);
    } catch (e) {
      console.log('Camera Error:', e);
    }
  };

  const handleGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({cropping: true});
      setSelectedImage(image.path);
      setResults(mockProductResults);
    } catch (e) {
      console.log('Gallery Error:', e);
    }
  };

  return (
    <Container>
      <TopBar>
        <GoBackButton onPress={() => navigation.navigate('Home')}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </GoBackButton>
        <HeaderText>Google Lens</HeaderText>
      </TopBar>

      <ButtonRow>
        <ActionButton onPress={handleCamera}>
          <MaterialIcons name="photo-camera" size={20} color="#fff" />
          <ButtonText>Camera</ButtonText>
        </ActionButton>
        <ActionButton onPress={handleGallery}>
          <MaterialIcons name="photo-library" size={20} color="#fff" />
          <ButtonText>Gallery</ButtonText>
        </ActionButton>
      </ButtonRow>

      {selectedImage && <UploadedImage source={{uri: selectedImage}} />}

      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        renderItem={({item}) => (
          <ResultCard>
            <ProductImage source={{uri: item.image}} />
            <ResultText>{item.title}</ResultText>
            <ResultSub>
              <SourceText>{item.source}</SourceText>
              <PriceText>{item.price}</PriceText>
            </ResultSub>
          </ResultCard>
        )}
      />
    </Container>
  );
};

export default ImageResultsScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #121212;
  padding: 16px;
`;

const TopBar = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
`;

const GoBackButton = styled.TouchableOpacity`
  padding: 6px;
`;

const HeaderText = styled.Text`
  font-size: 24px;
  color: #fff;
  font-weight: bold;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #1a73e8;
  padding: 10px 14px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  margin-left: 6px;
`;

const UploadedImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ResultCard = styled.View`
  background-color: #1f1f1f;
  padding: 10px;
  border-radius: 10px;
  width: 48%;
  margin-bottom: 14px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 150px;
  border-radius: 8px;
`;

const ResultText = styled.Text`
  font-size: 14px;
  color: #fff;
  margin-top: 6px;
  font-weight: bold;
`;

const ResultSub = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

const SourceText = styled.Text`
  font-size: 12px;
  color: #ccc;
`;

const PriceText = styled.Text`
  font-size: 12px;
  color: #4caf50;
  font-weight: bold;
`;
