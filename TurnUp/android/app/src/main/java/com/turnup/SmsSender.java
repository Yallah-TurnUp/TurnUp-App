package com.turnup;

import android.app.Activity;
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
import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public class SmsSender extends ReactContextBaseJavaModule {

    private static final String SENT_ACTION = "turnup.SMS_SENT";

    public SmsSender(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "SmsSender";
    }

    @ReactMethod
    public void sendSmsesToNumbers(ReadableArray numbers, ReadableArray messages, Callback smsesSent) {
        Context context = this.getReactApplicationContext();
        String namespace = SENT_ACTION + "." + new Date().getTime();

        listenForSentNotices(context, namespace, numbers.size(), smsesSent);
        sendSmses(context, namespace, numbers, messages);
    }

    private static void listenForSentNotices(final Context receiverContext,
                                             String namespace, final int targetSize,
                                             final Callback smsesSent) {
        final List<AtomicBoolean> finished = prepareFinishedStates(targetSize);
        final AtomicInteger count = new AtomicInteger();

        BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                int requestCode = intent.getIntExtra("requestCode", -1);
                if (requestCode < 0) return;

                if (finished.get(requestCode).getAndSet(true)) return; // Broadcast replayed, shouldn't happen.
                int currentCount = count.incrementAndGet();

                processResult();

                if (currentCount == targetSize) {
                    receiverContext.unregisterReceiver(this);
                    smsesSent.invoke();
                }
            }

            private void processResult() {
                switch (getResultCode()) {
                    case Activity.RESULT_OK:
                        System.out.println("SMS sent");
                        break;
                    case SmsManager.RESULT_ERROR_GENERIC_FAILURE:
                    case SmsManager.RESULT_ERROR_NO_SERVICE:
                    case SmsManager.RESULT_ERROR_NULL_PDU:
                    case SmsManager.RESULT_ERROR_RADIO_OFF:
                        System.out.println("Error occurred: " + getResultCode());
                        break;
                    default:
                        System.out.println("Unknown error occurred: " + getResultCode());
                        break;
                }
            }
        };

        receiverContext.registerReceiver(
                broadcastReceiver,
                new IntentFilter(namespace)
        );
    }

    private static List<AtomicBoolean> prepareFinishedStates(int size) {
        List<AtomicBoolean> finished = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            finished.add(new AtomicBoolean());
        }
        return finished;
    }

    private static void sendSmses(Context context, String namespace,
                           ReadableArray numbers, ReadableArray messages) {
        SmsManager smsManager = SmsManager.getDefault();
        for (int i = 0; i < numbers.size(); i++) {
            Intent sentIntent = new Intent(namespace);
            sentIntent.putExtra("requestCode", i);

            PendingIntent sentPI = PendingIntent.getBroadcast(
                    context, i, sentIntent, PendingIntent.FLAG_ONE_SHOT);
            smsManager.sendTextMessage(
                    numbers.getString(i), null, messages.getString(i), sentPI, null);
        }
    }
}
