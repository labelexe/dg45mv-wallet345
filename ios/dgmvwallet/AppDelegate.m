/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#import <AuthenticationServices/ASCredentialIdentityStore.h>
#import <AuthenticationServices/ASCredentialIdentityStoreState.h>

#import "CredentialProviderRequest.h"

#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif

// For GLOBALS only (such as background color)
// ToDo: Consider putting globals into objective c class.
#import "dgmvwallet-Swift.h"
#import "RNSplashScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"dgmvwallet"
                                            initialProperties:nil];

  rootView.backgroundColor = [GLOBALS ROOTVIEW_BACKGROUND_COLOR];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  
  [RNSplashScreen show];
  
  #if RCT_DEV
    [bridge moduleForClass:[RCTDevLoadingView class]];
  #endif
  
  // Set delegate
  CredentialProviderRequest* credentialProviderRequestModule = [[rootView bridge]  moduleForName:@"CredentialProviderRequest" lazilyLoadIfNecessary:YES];
  credentialProviderRequestModule.delegate = self;
  
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)autofillIsEnabled:(void (^)(BOOL))completionBlock {
  [[ASCredentialIdentityStore sharedStore] getCredentialIdentityStoreStateWithCompletion:^(ASCredentialIdentityStoreState * _Nonnull state) {
    completionBlock(state.enabled);
  }];
}

- (void)cancelledRequest:(NSString *)reason {
  // Not implemented in main app
}

- (void)generatedCredentials:(NSString *)username withPassword:(NSString *)password {
  // Not implemented in main app
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
