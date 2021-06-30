import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';

import { addEventListener, removeEventListener, requestPermissions, EuroMessageApi, VisilabsApi, setApplicationIconBadgeNumber, logToConsole, RDStoryView } from 'react-native-related-digital'

const App = () => {
  const [loading, setLoading] = useState(false)

  const appAlias = 'cimrimobilevoyager_android'

  const siteId = "5A44692F53514C4C4E2F733D";
  const organizationId = "686967394F5956585A506B3D";
  const dataSource = "cimri";

  const euroMessageApi = new EuroMessageApi(appAlias)
  const visilabsApi = new VisilabsApi(appAlias, siteId, organizationId, dataSource)

  useEffect(() => {
    logToConsole(true)

    addExtra()
    addListeners()

    return () => removeListeners()
  }, [])

  const addListeners = () => {

    addEventListener('register', async (token) => {

      console.log('token ', token)
      addExtra().then((res)=>euroMessageApi.subscribe(token));

      visilabsApi.register(token, (result) => {
        
      })
    }, (notificationPayload) => {
      console.log('notification payload', notificationPayload)
    }, euroMessageApi, visilabsApi)

    addEventListener('registrationError', async (registrationError) => {
      console.log('registrationError is ', registrationError)
    }, euroMessageApi)
  }

  const addExtra = async () => {
    await euroMessageApi.setUserProperty("email","baris.arslan@euromsg.com");
    await euroMessageApi.setUserProperty("keyID","baris.arslan@euromsg.com");
    await euroMessageApi.setUserProperty("pushPermit","Y");
    await euroMessageApi.setUserProperty("gsmPermit","N");
    await euroMessageApi.setUserProperty("emailPermit","Y");
  }
  
  
  const setBadgeNumber = () => {
    const number = 3
    setApplicationIconBadgeNumber(number)
  }

  const sendCustomEvent = () => {
    visilabsApi.customEvent('*', {
      'id': '1',
      'name': 'Product Name',
      'OM.exVisitorID':'baris.arslan@euromsg.com'
    })
  }

  const getRecommendations = async () => {
    try {
      const zoneId = '6'
      const productCode = ''

      // optional
      const filters = [{
        attribute: RecommendationAttribute.PRODUCTNAME,
        filterType: RecommendationFilterType.like,
        value: 'laptop'
      }]

      const recommendations = await visilabsApi.getRecommendations(zoneId, productCode, filters)
      console.log('recommendations', recommendations)
    }
    catch (e) {
      console.log('recommendations error', e)
    }
  }

  const showMailSubscriptionForm = () => {
    visilabsApi.customEvent('*pagename*', {
      'OM.pv': '77',
      'OM.pn': 'Product',
      'OM.ppr': '39'
    })
  }

  const getFavoriteAttributeActions = async () => {
    try {
      const actionId = '474'

      const favoriteAttrs = await visilabsApi.getFavoriteAttributeActions(actionId)
      console.log('favoriteAttributeActions', favoriteAttrs)
    }
    catch (e) {
      console.log('favoriteAttributeActions error', e)
    }
  }

  const removeListeners = () => {
    removeEventListener('register')
    removeEventListener('registrationError')
  }

  return (
    <>
      <SafeAreaView>
        {
          loading ?
          <ActivityIndicator 
            size='large'
            animating={loading} /> :
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <RDStoryView
              actionId={'1'} // optional
              onItemClicked={(data) => {
                console.log('Story data', data)
              }}
              style={{ flex: 1 }}
            />
            <Button 
              title='REQUEST PERMISSONS'
              onPress={() => {
                requestPermissions()
              }} 
            />
            <Button 
              title='SET BADGE NUMBER TO 3 (IOS)'
              onPress={() => {
                setBadgeNumber()
              }} 
            />
            <Button 
              title='SEND CUSTOM EVENT'
              onPress={() => {
                sendCustomEvent()
              }} 
            />
            <Button
              title='GET RECOMMENDATIONS'
              onPress={async () => {
                await getRecommendations()
              }}
            />
            <Button
              title='SHOW MAIL FORM'
              onPress={() => {
                showMailSubscriptionForm()
              }}
            />

            <Button
              title='GET FAVORITE ATTRIBUTE ACTIONS'
              onPress={async () => {
                await getFavoriteAttributeActions()
              }}
            />
          </ScrollView>
        }
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
    padding: 20
  },
  divider: {
    height: 20
  }
});

export default App;