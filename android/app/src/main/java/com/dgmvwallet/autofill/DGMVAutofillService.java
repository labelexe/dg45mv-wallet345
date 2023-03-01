package com.dgmvwallet.autofill;

import com.dgmvwallet.MainActivity;

import android.app.PendingIntent;
import android.app.assist.AssistStructure;
import android.content.Intent;
import android.content.IntentSender;
import android.os.CancellationSignal;
import android.service.autofill.AutofillService;
import android.service.autofill.FillCallback;
import android.service.autofill.FillRequest;
import android.service.autofill.FillResponse;
import android.service.autofill.SaveCallback;
import android.service.autofill.SaveRequest;
import android.util.Log;
import android.view.autofill.AutofillId;
import android.widget.RemoteViews;

import androidx.annotation.NonNull;

public class DGMVAutofillService extends AutofillService {
    @Override
    public void onFillRequest(FillRequest request, CancellationSignal cancellationSignal,
                              @NonNull FillCallback callback) {

        DGMVAutofillParser parser = new DGMVAutofillParser(request);
        boolean successfullyParsed = parser.parse();

        if (!successfullyParsed) {
            Log.d("DGMV-Autofill", "Failed to find password field");
            callback.onFailure("Failed to find password field");
            return;
        }

        RemoteViews authPresentation = new RemoteViews(getPackageName(), android.R.layout.simple_list_item_1);
        authPresentation.setTextViewText(android.R.id.text1, "DGMV Authenticator");

        Intent authIntent = new Intent(this, MainActivity.class);

        // Store webDomain address
        DGMVAutofillServiceBridge.setPackageName(getPackageName());
        DGMVAutofillServiceBridge bridge = DGMVAutofillServiceBridge.getInstance();
        bridge.prepareToStartExtension(parser);

        IntentSender intentSender = PendingIntent.getActivity(
                this,
                999,
                authIntent,
                PendingIntent.FLAG_CANCEL_CURRENT
        ).getIntentSender();

        // Successfully found field with password
        FillResponse response = new FillResponse.Builder()
                .setAuthentication(parser.getIds(), intentSender, authPresentation)
                .build();
        callback.onSuccess(response);
    }

    @Override
    public void onSaveRequest(SaveRequest request, SaveCallback callback) {
        // System.out.println("XXX");
    }
}
