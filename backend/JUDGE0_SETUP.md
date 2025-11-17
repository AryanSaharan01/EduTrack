# Judge0 API Integration Setup

## Overview
This application uses Judge0 API to execute and test student code submissions in real-time. Judge0 provides a robust code execution engine supporting multiple programming languages.

## Configuration

### 1. Get Your Judge0 API Key

You have two options:

#### Option A: RapidAPI (Recommended for Production)
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to [Judge0 CE on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce)
3. Copy your API key from the dashboard

#### Option B: Self-Hosted (For Development)
1. Follow the [Judge0 installation guide](https://github.com/judge0/judge0/blob/master/CHANGELOG.md)
2. Run Judge0 locally using Docker
3. No API key needed for localhost

### 2. Configure Environment Variables

Add the following to your `.env` file in the `backend` folder:

```env
# Judge0 API Configuration
JUDGE0_API_KEY=YOUR_RAPIDAPI_KEY_HERE
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# For self-hosted Judge0, use:
# JUDGE0_API_HOST=localhost:2358
# JUDGE0_API_KEY=  (leave empty for self-hosted)
```

### 3. Install Required Dependencies

The `axios` package is already included in the backend dependencies. If not, run:

```bash
cd backend
npm install axios
```

## Supported Languages

The Judge0 service currently supports:
- Python (3.8+)
- JavaScript (Node.js)
- Java
- C++
- C
- C#
- Ruby
- Go
- PHP
- Swift
- Kotlin
- Rust
- TypeScript

## API Endpoints

### Run Code
**POST** `/tasks/run-code`

Execute student code and return the output.

**Request Body:**
```json
{
  "code": "print('Hello World')",
  "language": "python",
  "stdin": ""  // Optional input
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "success": true,
    "output": "Hello World",
    "error": null,
    "status": "Accepted",
    "time": "0.02",
    "memory": 3456,
    "token": "abc123..."
  }
}
```

### Test Code
**POST** `/tasks/test-code`

Execute student code and compare output with expected result.

**Request Body:**
```json
{
  "code": "print('Hello World')",
  "language": "python",
  "expectedOutput": "Hello World",
  "stdin": ""
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "success": true,
    "passed": true,
    "output": "Hello World",
    "expectedOutput": "Hello World",
    "actualOutput": "Hello World",
    "message": "All test cases passed!",
    "time": "0.02",
    "memory": 3456
  }
}
```

### Get Supported Languages
**GET** `/tasks/languages`

Returns list of all supported programming languages.

### Check Judge0 Status
**GET** `/tasks/judge0-status`

Validates Judge0 API connection and configuration.

## Error Handling

The service handles various execution scenarios:

### 1. Compilation Errors
```
Status: Compilation Error
Output: Shows compiler error messages
```

### 2. Runtime Errors
```
Status: Runtime Error
Output: Shows error message and stack trace
```

### 3. Time Limit Exceeded
```
Status: Time Limit Exceeded
Output: Your code took too long to execute
```

### 4. Wrong Answer
```
Status: Wrong Answer
Output: Shows actual output vs expected output
```

## Usage in Student Task Attempt

Students can now:

1. **Write Code**: Use the Monaco editor to write their solution
2. **Run Code**: Click "Run Code" to execute and see output
3. **Test Code**: Click "Test Code" to validate against expected output
4. **View Results**: See execution time, memory usage, and detailed output
5. **Submit**: Submit their final answer when satisfied

## Features

### Security
- Code executes in isolated containers
- Time and memory limits enforced
- No access to system resources

### Real-time Feedback
- Instant code execution (1-3 seconds)
- Syntax and runtime error detection
- Output comparison with expected results

### Anti-Cheating
- All submissions logged
- Tab switch detection
- Fullscreen enforcement
- Execution history tracked

## Troubleshooting

### Error: "Failed to connect to Judge0 API"
- Check your API key is correct
- Verify JUDGE0_API_KEY in .env file
- Ensure you have an active RapidAPI subscription
- Check your internet connection

### Error: "Time Limit Exceeded"
- Student code has infinite loops
- Algorithm is too slow
- Increase time limits if needed

### Error: "Compilation Error"
- Syntax errors in student code
- Wrong language selected
- Missing imports or dependencies

### Error: "Memory Limit Exceeded"
- Code uses too much memory
- Check for memory leaks
- Optimize data structures

## Rate Limits

RapidAPI Free Tier:
- 50 requests per day
- 5 requests per minute

For production, consider upgrading to a paid plan with higher limits.

## Testing the Integration

Test the Judge0 integration:

```bash
# Test Python code
curl -X POST http://localhost:5000/api/tasks/run-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "print(\"Hello World\")",
    "language": "python"
  }'

# Test with expected output
curl -X POST http://localhost:5000/api/tasks/test-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "print(\"Hello World\")",
    "language": "python",
    "expectedOutput": "Hello World"
  }'

# Check status
curl http://localhost:5000/api/tasks/judge0-status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Best Practices

1. **Set Reasonable Time Limits**: Default is 5 seconds per execution
2. **Monitor API Usage**: Track RapidAPI usage in dashboard
3. **Cache Results**: Consider caching for repeated submissions
4. **Log Errors**: All execution errors are logged for debugging
5. **Validate Input**: Always validate code before submission
6. **Handle Edge Cases**: Empty code, invalid languages, etc.

## Support

For issues:
- Judge0 Documentation: https://ce.judge0.com/
- RapidAPI Support: https://rapidapi.com/support
- GitHub Issues: Create issue in your repository

## License

Judge0 is open source under the GNU General Public License v3.0.
