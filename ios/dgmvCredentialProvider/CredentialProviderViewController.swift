//
//  CredentialProviderViewController.swift
//  DGMV Authenticator
//
//  Created by Julian Jäger on 21.02.22.
//  Copyright © 2022 DigiCorp Labs. All rights reserved.
//

import AuthenticationServices
import React

class CredentialProviderViewController: ASCredentialProviderViewController {
  
    override func prepareCredentialList(for serviceIdentifiers: [ASCredentialServiceIdentifier]) {
      
      // Get Bundle Location
      let jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource: nil, fallbackExtension: nil)!
      
      // Prepare initial props that informs the application to not show the main application screen, but a special authentication screen
      let initialProps: [String: Any] = [
        "isActionExtension": true,
        "serviceIdentifiers": serviceIdentifiers.map({ ["identifier": $0.identifier, "type": $0.type]
        }),
      ]
      
      // Instantiate Root View
      let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "dgmvwallet", initialProperties: initialProps, launchOptions: nil)
  
      self.view.backgroundColor = GLOBALS.ROOTVIEW_BACKGROUND_COLOR
      rootView.backgroundColor = GLOBALS.ROOTVIEW_BACKGROUND_COLOR
      
      // Set delegate
      let module = rootView.bridge.module(forName: "CredentialProviderRequest") as! CredentialProviderRequest
      module.delegate = self
      
      // Delay the view replacement for about a second.
      // This will seem like it's loading the content
      DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(1000)) {
        self.view = rootView
      }
    }

    /*
     Implement this method if your extension supports showing credentials in the QuickType bar.
     When the user selects a credential from your app, this method will be called with the
     ASPasswordCredentialIdentity your app has previously saved to the ASCredentialIdentityStore.
     Provide the password by completing the extension request with the associated ASPasswordCredential.
     If using the credential would require showing custom UI for authenticating the user, cancel
     the request with error code ASExtensionError.userInteractionRequired.

    override func provideCredentialWithoutUserInteraction(for credentialIdentity: ASPasswordCredentialIdentity) {
        let databaseIsUnlocked = true
        if (databaseIsUnlocked) {
            let passwordCredential = ASPasswordCredential(user: "j_appleseed", password: "apple1234")
            self.extensionContext.completeRequest(withSelectedCredential: passwordCredential, completionHandler: nil)
        } else {
            self.extensionContext.cancelRequest(withError: NSError(domain: ASExtensionErrorDomain, code:ASExtensionError.userInteractionRequired.rawValue))
        }
    }
    */

    /*
     Implement this method if provideCredentialWithoutUserInteraction(for:) can fail with
     ASExtensionError.userInteractionRequired. In this case, the system may present your extension's
     UI and call this method. Show appropriate UI for authenticating the user then provide the password
     by completing the extension request with the associated ASPasswordCredential.

    override func prepareInterfaceToProvideCredential(for credentialIdentity: ASPasswordCredentialIdentity) {
    }
    */
}

extension CredentialProviderViewController: CredentialProviderRequestProtocol {
  func cancelledRequest(_ reason: String!) {
    self.extensionContext.cancelRequest(withError: NSError(domain: ASExtensionErrorDomain, code: ASExtensionError.userCanceled.rawValue))
  }
  
  func generatedCredentials(_ username: String!, withPassword password: String!) {
    let passwordCredential = ASPasswordCredential(user: username, password: password)
    self.extensionContext.completeRequest(withSelectedCredential: passwordCredential, completionHandler: nil)
  }
  
  func autofillIsEnabled(_ completion: @escaping (Bool) -> ()){
    ASCredentialIdentityStore.shared.getState { state in
      completion(state.isEnabled);
    }
  }
}
