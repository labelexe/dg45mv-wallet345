import React from 'react';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useWindowDimensions} from 'react-native';
import {useMediaQuery} from 'react-responsive';

import {
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import OnboardingStepPage, { OnboardingStepPageHandle } from './OnboardingStepPage';
import TextView from './TextView';

import IMAGE_SHINYRING from '../../assets/images/shiny_ring.png';
import IMAGE_SHINYRING_FOCUS from '../../assets/images/shiny_ring_focus.png';
import IMAGE_NEXT from '../../assets/images/next.png';
import IMAGE_PREV from '../../assets/images/prev.png';

import type {RootStackParamList} from '../App';
import {Item} from '../screens/OnboardingScreen';

interface OnboardingHScrollviewProps {
  items: Array<Item>
  navigation: NativeStackNavigationProp<RootStackParamList, 'OnboardingScreen'>
  itemsPerInterval: number
}

const OnboardingHScrollview = (props: OnboardingHScrollviewProps) => {
  const {items, navigation} = props;

  const itemsPerInterval: number =
    props.itemsPerInterval === undefined ? 1 : props.itemsPerInterval;

  const scrollViewRef = React.useRef<ScrollView | null>();
  const {width} = useWindowDimensions();

  const isTabletOrMobileDevice = useMediaQuery({
    minDeviceWidth: 1224,
    query: '(min-device-width: 1224px)',
  });

  const [scrollIntervals, setScrollIntervals] = React.useState(1);
  const [scrollInterval, setScrollInterval] = React.useState(0);
  const [viewWidth, setViewWidth] = React.useState(0);

  const refs = React.useMemo(() => {
    return items.map(() => React.createRef<OnboardingStepPageHandle>());
  }, [items]);

  React.useEffect(() => {
    const firstRef = refs[0];
    if (!firstRef || !firstRef.current) return;
    firstRef.current.appear();
  }, [refs]);

  const updateScrollInterval = (newScrollInterval: number) => {
    if (newScrollInterval === scrollInterval) {
      return;
    }

    const activeElement = refs[newScrollInterval].current;
    if (activeElement) activeElement.appear();

    setScrollInterval(newScrollInterval);
  };

  const scrollToPage = React.useCallback(
    (index: number) => {
      scrollViewRef.current?.scrollTo({
        x: width * index,
        animated: true,
      });
    },
    [scrollViewRef, width],
  );

  const init = (width: number) => {
    setViewWidth(width);
    const totalItems: number = items.length;
    setScrollIntervals(Math.ceil(totalItems / itemsPerInterval));
  };

  const getInterval = (offset: number) => {
    for (let i = 0; i < scrollIntervals; i++) {
      if (offset <= (viewWidth / scrollIntervals) * i) {
        return i;
      }

      if (i >= scrollIntervals - 1) {
        return scrollIntervals - 1;
      }
    }
  };

  const handleScrollChange = (
    data: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    setViewWidth(data.nativeEvent.contentSize.width);

    const scrollInterval: number =
      getInterval(data.nativeEvent.contentOffset.x) || 0;

    updateScrollInterval(scrollInterval);
    // setScrollInterval(scrollInterval);
  };

  const handlePrev = () => {
    scrollViewRef.current?.scrollTo({
      x: width * (scrollInterval - 1),
      animated: true,
    });
  };

  const gotoNextScreen = () => {
    navigation.navigate('SetupScreen');
  };

  const handleNext = () => {
    if ((scrollInterval + 1) >= scrollIntervals) {
      gotoNextScreen();
    } else {
      scrollViewRef.current?.scrollTo({
        x: width * (scrollInterval + 1),
        animated: true,
      });
    }
  };

  const pagination = React.useMemo(() => {
    return new Array(items.length).fill(null).map((data, i) => (
      <TouchableOpacity
        key={`pagination_${i}`}
        style={styles.paginationImageContainer}
        onPress={() => scrollToPage(i)}>
        <Image
          source={
            scrollInterval == i ? IMAGE_SHINYRING_FOCUS : IMAGE_SHINYRING
          }
          style={styles.paginationImage}
        />
      </TouchableOpacity>
    ));
  }, [scrollInterval, items.length, scrollToPage]);

  return (
    <View style={styles.container}>
      <View style={styles.scrollViewContainer}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            ...styles.scrollView,
            width: `${100 * scrollIntervals}%`,
          }}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={(w) => init(w)}
          onScroll={(data) => {
            handleScrollChange(data);
          }}
          scrollEventThrottle={200}
          pagingEnabled
          decelerationRate="fast"
          ref={(ref) => (scrollViewRef.current = ref)}
        >
          {items.map((item: Item, index: number) => {
            return (
              <OnboardingStepPage
                ref={refs[index]}
                key={index}
                index={index}
                title={item.title}
                subtitle={item.subtitle}
                imageURI={item.imageURI}
              />
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>{pagination}</View>

        <View style={styles.arrowNavigationContainer}>
          <TouchableOpacity
            style={{opacity: scrollInterval}}
            onPress={handlePrev}
            disabled={scrollInterval == 0}>
            <Image source={IMAGE_PREV} style={styles.arrowContainer} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skip_button}
            onPress={() => gotoNextScreen()}>
            <TextView
              fontWeight={'light'}
              fontSize={isTabletOrMobileDevice ? 25 : 15}>
              SKIP ONBOARDING
            </TextView>
          </TouchableOpacity>          

          <TouchableOpacity onPress={handleNext}>
            <Image source={IMAGE_NEXT} style={styles.arrowContainer} />
          </TouchableOpacity>
        </View>          
      </View>    
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    height: '80%',
  },

  scrollView: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },

  footer: {
    marginBottom: 0,
    marginTop: 12,
    justifyContent: 'flex-end',
  },

  paginationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  paginationImageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  paginationImage: {
    width: 50,
    height: 50,
    marginLeft: -8,
    marginRight: -8,
    resizeMode: 'contain',
  },

  skip_button: {
    alignItems: 'center',
    padding: 5,
    opacity: 0,
  },

  statsHead: {
    paddingTop: 10,
    paddingHorizontal: 12,
  },

  container: {
    width: '100%',
    borderRadius: 8,
    marginTop: 10,
  },

  arrowContainer: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  arrowNavigationContainer: {
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
});

export default OnboardingHScrollview;
