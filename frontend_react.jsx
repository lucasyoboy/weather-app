import React from 'react';
import axios from 'axios';
import {Text, View, ImageBackground, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWind, faDroplet, faArrowsUpDown, faDownLeftAndUpRightToCenter, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const image = require('./assets/clouds.jpg')

export default function App(){
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const getData = () => {
    axios.get('https://station.lucasdev.app/realtime')
    .then(function (response) {
      setData(response.data);
      console.log(response.data);
    })
  };

  const onLoading = React.useCallback(() => {
    setLoading(true);
    getData();
    setLoading(false);
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return(
    <View className="flex-1">
      <ImageBackground source={image} resizeMode="cover" className="flex-1 justify-center">
          <ScrollView
            className="absolute top-0 w-full h-4/6"
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onLoading} />
              
            }>
            <View className="flex-1 items-center mt-5">
              <Text className="text-sm">Desliza abajo para actualizar.</Text>
              <FontAwesomeIcon icon={faChevronDown} color='#FFF' />
            </View>
          </ScrollView>
        <View className="flex-1 items-center justify-end">
          <Text className="text-4xl text-white font-bold">{data.date}</Text>
          <Text className="text-3xl text-white font-normal">{data.time}</Text>
          <Text className="text-9xl text-white font-extrabold mt-3">{data.temperature}°</Text>
        </View>
        <View className="flex-1 flex-row items-end justify-around w-full p-5">
          <View className="justify-center items-center">
            <FontAwesomeIcon icon={faWind} size={ 50 } color={ '#51C5EE' } />
            <Text style={styles.textData}>{data.windspeed} km/h</Text>
          </View>
          <View className="justify-center items-center"> 
            <FontAwesomeIcon icon={faArrowsUpDown} size={ 50 } color={ '#51C5EE' } />
            <Text style={styles.textData}>{data.altitude} m</Text>
          </View>
          <View className="justify-center items-center">
            <FontAwesomeIcon icon={faDroplet} size={ 50 } color={ '#51C5EE' } />
            <Text style={styles.textData}>{data.humidity} %</Text>
          </View>
          <View className="justify-center items-center">
            <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} size={ 50 } color={ '#51C5EE' } />
            <Text style={styles.textData}>{data.pressure} hPa</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
  textData: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 40,
    color: '#51C5EE'
  }
});
