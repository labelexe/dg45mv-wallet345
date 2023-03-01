//
//  CredentialProviderRequest.m
//  DGMV Authenticator Credential Provider
//
//  Created by Julian Jäger on 22.02.22.
//  Copyright © 2022 DigiCorp Labs. All rights reserved.
//

#import "CredentialProviderRequest.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

@implementation CredentialProviderRequest

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(authenticationRequestCompleted:(NSString*)username password:(NSString*)password) {
  [self.delegate generatedCredentials:username withPassword:password];
}

RCT_EXPORT_METHOD(authenticationRequestCancelled: (NSString*)reason) {
  [self.delegate cancelledRequest:reason];
}

RCT_EXPORT_METHOD(askForPermissions) {
  // do nothing
}

RCT_EXPORT_METHOD(autofillIsEnabled: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [self.delegate autofillIsEnabled:^(BOOL result) {
    resolve(@(result));
  }];
}

RCT_EXPORT_METHOD(autofillIsSupported: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  BOOL result = TRUE;
  resolve(@(result));
}

@end
