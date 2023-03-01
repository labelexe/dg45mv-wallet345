package com.dgmvwallet;

import static android.view.autofill.AutofillManager.EXTRA_AUTHENTICATION_RESULT;

import android.content.Intent;
import android.os.Bundle;
import android.service.autofill.Dataset;
import android.service.autofill.FillResponse;
import android.util.Log;
import android.widget.RemoteViews;

import com.dgmvwallet.autofill.DGMVAutofillServiceBridge;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

import java.util.ArrayList;
import java.util.Arrays;

public class MainActivity extends ReactActivity implements DGMVAutofillServiceBridge.CompletionHandler {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "dgmvwallet";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected Bundle getLaunchOptions() {
        Bundle initialProperties = super.getLaunchOptions();
        if (initialProperties == null) initialProperties = new Bundle();

        DGMVAutofillServiceBridge.setPackageName(getPackageName());
        DGMVAutofillServiceBridge bridge = DGMVAutofillServiceBridge.getInstance();
        DGMVAutofillServiceBridge.RequestInfo requestInfo = bridge.getRequestInfo();

        if (requestInfo.willStartExtension()) {
          bridge.registerCompletionHandler(MainActivity.this);

          ArrayList<Bundle> serviceIdentifiers = new ArrayList<Bundle>();

          if (requestInfo.hasURL()) {
            Bundle test = new Bundle();
            test.putString("identifier", requestInfo.getURL());
            test.putString("type", "domain");
            serviceIdentifiers.add(test);
          }

          initialProperties.putBoolean("isActionExtension", true);
          initialProperties.putParcelableArrayList("serviceIdentifiers", serviceIdentifiers);

        } else {
          bridge.registerCompletionHandler(null);
        }

        return initialProperties;
      }
    };
  }

  @Override
  public void requestCompleted(FillResponse fillResponse) {
    Intent replyIntent = new Intent();
    replyIntent.putExtra(EXTRA_AUTHENTICATION_RESULT, fillResponse);
    setResult(RESULT_OK, replyIntent);
    finish();
  }

  @Override
  public void requestCancelled(String reason) {
    setResult(RESULT_CANCELED);
    finish();
  }
}
