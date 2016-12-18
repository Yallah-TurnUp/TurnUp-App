package com.turnup;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.telephony.SmsManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.Date;

public class SmsSender extends ReactContextBaseJavaModule {

    private static final String SENT_ACTION = "turnup.SMS_SENT";
    private static final String DELIVERED_ACTION = "turnup.SMS_DELIVERED";

    public SmsSender(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "SmsSender";
    }

    @ReactMethod
    public void sendSmsToNumber(int uniqueMsgId, String number, String message, Callback delivered) {
        Context context = this.getReactApplicationContext();
        String sentNamespace = SENT_ACTION + "." + new Date().getTime();
        String deliveredNamespace = DELIVERED_ACTION + "." + new Date().getTime();

//        listenForDeliveredNotice(context, deliveredNamespace, uniqueMsgId, delivered);
        listenForSentNotice(context, sentNamespace, uniqueMsgId, delivered);
        sendSms(context, sentNamespace, deliveredNamespace, uniqueMsgId, number, message);
    }

    private void sendSms(Context context, String sentNamespace, String deliveredNamespace,
                         int uniqueMsgId, String number, String message) {
        System.out.println(message);
        SmsManager smsManager = SmsManager.getDefault();
        ArrayList<String> dividedMessage = smsManager.divideMessage(message);
        System.out.println(dividedMessage);
        Intent sentIntent = new Intent(sentNamespace);
        sentIntent.putExtra("uniqueMsgId", uniqueMsgId);
        Intent deliveredIntent = new Intent(deliveredNamespace);
        deliveredIntent.putExtra("uniqueMsgId", uniqueMsgId);

        // uniqueMsgId is also the PendingIntent's requestCode.
        // We don't listen for the 'sent' broadcast, only for the 'delivered' broadcast.
        PendingIntent sentPI = PendingIntent.getBroadcast(
                context, uniqueMsgId, sentIntent, PendingIntent.FLAG_ONE_SHOT);
        PendingIntent deliveredPI = PendingIntent.getBroadcast(
                context, uniqueMsgId, deliveredIntent, PendingIntent.FLAG_ONE_SHOT);
//        smsManager.sendTextMessage(number, null, message, sentPI, deliveredPI);
        ArrayList<PendingIntent> sentPIs = new ArrayList<>();
        for (String dm : dividedMessage) sentPIs.add(sentPI);
        ArrayList<PendingIntent> deliveredPIs = new ArrayList<>();
        for (String dm : dividedMessage) deliveredPIs.add(deliveredPI);
//        sentPIs.set(dividedMessage.size() - 1, sentPI);
//        deliveredPIs.set(dividedMessage.size() - 1, deliveredPI);
        smsManager.sendMultipartTextMessage(number, null, dividedMessage, sentPIs, deliveredPIs);
    }

    private void listenForDeliveredNotice(final Context receiverContext,
                                          String namespace,
                                          final int uniqueMsgId,
                                          final Callback delivered) {
        BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                int requestCode = intent.getIntExtra("uniqueMsgId", -1);
                if (requestCode < 0 || requestCode != uniqueMsgId) return;

                receiverContext.unregisterReceiver(this);
                delivered.invoke();
            }
        };

        receiverContext.registerReceiver(
                broadcastReceiver,
                new IntentFilter(namespace)
        );
    }

    // Practically the same as listenForDeliveredNotice, except we just change method signature
    // to use 'sent'.
    private void listenForSentNotice(final Context receiverContext,
                                     String namespace,
                                     final int uniqueMsgId,
                                     final Callback sent) {
        BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                int requestCode = intent.getIntExtra("uniqueMsgId", -1);
                if (requestCode < 0 || requestCode != uniqueMsgId) return;

                receiverContext.unregisterReceiver(this);
                sent.invoke();
            }
        };

        receiverContext.registerReceiver(
                broadcastReceiver,
                new IntentFilter(namespace)
        );
    }
}