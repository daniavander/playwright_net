import { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult, TestStep } from '@playwright/test/reporter';

import { writeFileSync } from 'fs';

class MyReporter implements Reporter {
  count = { total: 0, passed: 0, failed: 0, skipped: 0, timedOut: 0, flaky: 0 };
  arr_err: any = [];
  currentTestIndex = 0;

  async onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
    this.count['total'] = suite.allTests().length;
  }

  async onTestBegin(test: TestCase, result: TestResult) {
    this.currentTestIndex += 1;
    console.log(`\x1b[33m${this.currentTestIndex} - Starting test ${test.title}\x1b[0m`);
    if (result.retry > 0) {
      console.log(`\u001b[1;30;43m RETRY: ${result.retry} ${test.title} \u001b[0m`);
    }
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    let statusColor = '\x1b[0m';
    switch (result.status) {
      case 'passed':
        statusColor = '\x1b[42m\x1b[30m'; // green bg, black text
        break;
      case 'failed':
      case 'timedOut':
        statusColor = '\x1b[41m\x1b[30m'; // red bg, black text
        break;
      case 'skipped':
        statusColor = '\x1b[44m\x1b[97m'; // blue bg, white text
        break;
    }

    console.log(`${statusColor}Finished test ${test.title}: ${result.status}\x1b[0m`);
    await this.collectStatus(result);
  }

  async onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    if (step.category === 'test.step') {
      console.log(`\x1b[92mStep: ${step.title}\x1b[0m`); // Light green for test.step
    } else {
      console.log(`\x1b[96mSub-action: ${step.title}\x1b[0m`); // Lighter green for sub-actions
    }
  }

  async onEnd(result: FullResult) {
    console.log(`\x1b[32mFinished the run: ${result.status}\x1b[0m`);
    //this.writeSummaryToFile();

    this.printTestSummary();

    // Format duration in minutes and seconds
    const minutes = Math.floor(result.duration / 60000);
    const seconds = ((result.duration % 60000) / 1000).toFixed(2);
    console.log(`\x1b[32mTotal duration: ${minutes} min ${seconds} sec\x1b[0m`);

    if (this.count['failed'] > 0) {
      this.arr_err.forEach((errorArray) => {
        errorArray.forEach((error) => {
          console.log(`\x1b[31mError Message: ${error.message}\x1b[0m`);
          //console.log(`\x1b[31mStack Trace: ${error.stack || 'No stack trace'}\x1b[0m`);
        });
      });
    }
    //this.writeSummaryToFile();
  }

  async collectStatus(status: TestResult) {
    switch (status.status) {
      case 'failed':
        this.count['failed'] += 1;
        this.arr_err.push(status.errors);
        break;
      case 'timedOut':
        this.count['timedOut'] += 1;
        this.count['failed'] += 1; //timeout as failures
        this.arr_err.push(status.errors);
        break;
      case 'skipped':
        this.count['skipped'] += 1;
        break;
      case 'passed':
        this.count['passed'] += 1;
        // Now, flaky only increases if the test retried and eventually passed.
        // If a test retries multiple times and still fails, it won't be counted as flaky.
        // Final flaky count = retried tests that eventually passed.
        if (status.retry > 0) {
          this.count['flaky'] += 1;
        }
        break;
    }
  }

  // **Function to Print the Current Summary After Each Test**
  printTestSummary() {
    console.log(`
    \x1b[36m=============================
     Current Test Summary:
      - ⌛ Total: ${this.count['total']}
      - ✅ Passed: ${this.count['passed']}
      - ❌ Failed: ${this.count['failed']}
      - ⌛ Timeout: ${this.count['timedOut']}
      - 🔄 Retry: ${this.count['flaky']}
      - ⏩ Skipped: ${this.count['skipped']}
    =============================\x1b[0m
    `);
  }

  // **Write Summary to File at the End**
  writeSummaryToFile() {
    const resultMarkdownMessage = `
        Test run results
        Summary:
      - ⌛ Total test cases: ${this.count['total']}
      - 📦 Test results: 
        - ✅ Passed: ${this.count['passed']}
        - ❌ Failed: ${this.count['failed']}
        - ⏳ Timed Out: ${this.count['timedOut']}
        - 🔄 Retry (Flaky): ${this.count['flaky']}
        - ⏩ Skipped: ${this.count['skipped']}
    `;

    writeFileSync('./playwright-report/result.txt', resultMarkdownMessage, {
      flag: 'w',
    });
  }
}

export default MyReporter;
