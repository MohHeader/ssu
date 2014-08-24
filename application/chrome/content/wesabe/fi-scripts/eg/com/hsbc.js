wesabe.download.Player.register({
  fid: 'eg.com.hsbc',
  org: 'HSBC (EG)',

  dispatchFrames: false,
  afterDownload: 'nextAccount',

  actions: {
    main: function() {
      browser.go("https://www.hsbc.com.eg/1/2/eg/ways-to-bank-with-us/logon");
    },
    login: function() {
      page.click(e.login.login_button);
    },
    insert_bankid: function() {
      page.fill(e.login.bankid.input, answers.username);
      page.click(e.login.bankid.button);
    },
    login_with_password_page: function() {
      page.click(e.login.login_with_password);
    },
    fillpassword_and_login: function() {
      job.update('auth.pass');
      page.fill(e.login.memorable.input, answers.memorable);
      
      for (var i = 1; i <=  answers.securityKey.length; i++) {
        try {
          var element = page.findByXpath('//input[starts-with(@id,"keyrcc_password_first")]['+i+']')
          if (element.disabled == false) {
            page.fill(bind(e.login.passwordKey.input, {n: i}),answers.securityKey[i-1] )
          }else{
            log.warn("Skipping character in security key because: ----------");
          }
        } catch (e) {
          log.warn("Skipping character in security key because: ", e);
        }
      }
      page.click(e.login.passwordContinueButton);
      job.succeed();
    }
  },

  dispatch: function() {
    if (page.present(e.login.login_statment))
      action.login();
    else if (page.present(e.login.bankid.statment))
      action.insert_bankid();
    else if (page.present(e.login.login_with_password))
      action.login_with_password_page();
    else if (page.present(e.login.passwordKey.statment))
      action.fillpassword_and_login();
  },
  elements: {
    login: {
      login_button: ['/html/body/div/div[4]/div/div/div/div/p[2]/a'],
      login_statment: ['//*[img[contains(@alt, "Log on to Internet Banking")]]'],
      bankid: {
        statment: ['//label[contains(string(.),"Please enter your Internet Banking ID")]'],
        input: ['//*[@id="username"]'],
        button: ['//input[@value="Continue"]']
      },
      login_with_password: ['//a[contains(string(.),"login with password")]'],
      memorable: {
        statment: ['//h2[contains(string(.),"Enter memorable answer")]'],
        input: ['//*[@id="memorableAnswer"]']
      },
      passwordKey: {
        statment: ['//h3[contains(string(.),"Enter Password")]'],
        input: ['//input[starts-with(@id,"keyrcc_password_first")][:n]']
      },
      passwordContinueButton:['//input[@value="Continue"]'],
      user: {
        field: ['//form[@name="signin"]//input[@type="text"][@name="user"]']
      },
      pass: {
        field: ['//input[@type="password"][@name="pass"]', '//form[@name="signin"]//input[@type="password"]']
      },
      continueButton: [],
      error: {
        user: ['//text()[contains(., "Invalid username")]'],
        pass: ['//text()[contains(., "Invalid password")]'],
        creds: ['//text()[contains(., "Invalid username or password")]'],
        general: ['//text()[contains(., "Could not log you in")]'],
        noAccess: ['//text()[contains(., "Your account has been locked")]']
      }
    },
    logoff: {
      link: ['//span[contains(string(.),"You are logged on to Internet Banking")]']
    },
    passwordSecurityKey: [
      // '/html/body/div[2]/div[6]/div/div[7]/div/div[1]/div/div/div/form/div[2]/div[1]/div/div[2]/div/fieldset[2]/table/tbody/tr/td[2]/div/input'
      // '//form[@name="inputForm"]//*[has-class("id_key") and string(text())=":n"]',
      // '//*[has-class("id_key") and string(text())=":n"]',
      // '//*[string(text())=":n"]'
      '//input[starts-with(@id,"keyrcc_password_first")])'
    ]
  }
});

// wesabe.util.privacy.registerSanitizer('HSBC Keyboard Key', /\bid\d+_key\b/g);
