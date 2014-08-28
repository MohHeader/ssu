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
            if(i <= 6)
              page.fill(bind(e.login.passwordKey.input, {n: i}),answers.securityKey[i-1] )
            else if( i == 7)
              page.fill(bind(e.login.passwordKey.input, {n: i}),answers.securityKey[answers.securityKey.length - 2 ] )
            else if( i == 8)
              page.fill(bind(e.login.passwordKey.input, {n: i}),answers.securityKey[answers.securityKey.length - 1 ] )
          }else{
            log.warn("Skipping character in security key because: ----------");
          }
        } catch (e) {
          log.warn("Skipping character in security key because: ", e);
        }
      }
      page.click(e.login.passwordContinueButton);
    },
    go_to_statments_page: function(){
      browser.go("https://www.hsbc.com.eg/1/3/site-pages/internet-banking/statements-advices/e-statement");
    },
    download_statment: function(){
      // page.click(e.statment_page.download);
      browser.go("https://www.hsbc.com.eg"+page.findByXpath('(//span[@title="Click here to Download PDF"])[1]/..').getAttribute("href"));
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
    else if(page.present(e.summary.statment))
      action.go_to_statments_page();
    else if(page.present(e.statment_page.statment))
      action.download_statment();
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
    summary:{
      statment:['//h3[contains(string(.),"Cheque Book/Savings Accounts")]']
    },
    statment_page:{
      statment:['//b[contains(string(.),"Instructions to Download e-Statements")]'],
      download:['(//span[@title="Click here to Download PDF"])[1]/..'],
      href:['(//span[@title="Click here to Download PDF"])[1]/../@href']
    }
  }
});

// wesabe.util.privacy.registerSanitizer('HSBC Keyboard Key', /\bid\d+_key\b/g);
