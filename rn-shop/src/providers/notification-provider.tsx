import { useState, useEffect, useRef, PropsWithChildren } from 'react'
import * as Notifications from 'expo-notifications'
import registerForPushNotificationsAsync from '../lib/notification'
import { supabase } from '../lib/supabase'
import React from 'react'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined)
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  const saveUserPushNotificationToken = async (token: string) => {
    if (!token.length) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) return

    await supabase
      .from('users')
      .update({
        expo_notification_token: token,
      })
      .eq('id', session.user.id)
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token: any) => {
        setExpoPushToken(token ?? '')
        saveUserPushNotificationToken(token ?? '')
      })
      .catch((error: any) => setExpoPushToken(`${error}`))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return <>{children}</>
}

export default NotificationProvider
