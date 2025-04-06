import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../theme/colors';
import useVoiceInput from '../hooks/useVoiceInput';

const SearchBar = ({search, setSearch}) => {
  const {startListening} = useVoiceInput(setSearch);

  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={styles.icon}
      />

      <TextInput
        style={styles.input}
        placeholder="Search or type URL"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={colors.textSecondary}
      />

      <TouchableOpacity onPress={startListening}>
        <Ionicons
          name="mic"
          size={20}
          color={colors.iconBlue}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <MaterialIcons
          name="camera-alt"
          size={20}
          color={colors.iconGreen}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
