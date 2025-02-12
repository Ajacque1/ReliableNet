from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/speedtest', methods=['GET'])
def run_speed_test():
    return jsonify({
        "download_speed": 120,  # Mock Mbps
        "upload_speed": 40,    # Mock Mbps
        "ping": 15             # Mock ms
    })

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()

        # Extract form data
        isp = data.get('isp')
        rating = data.get('rating')
        lag = data.get('lag')
        comments = data.get('comments')

        if not isp or not rating or not lag:
            return jsonify({"error": "Missing required fields"}), 400

        # Print feedback for now (Later, we'll store it in a database)
        print(f"Feedback received: ISP={isp}, Rating={rating}, Lag={lag}, Comments={comments}")

        return jsonify({"message": "Thank you for your feedback!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
