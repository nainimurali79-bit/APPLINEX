from django.http import HttpResponse, JsonResponse

def api_root(request):
    """
    Root view for http://127.0.0.1:8000/
    Provides an interactive landing page or JSON metadata describing available API endpoints.
    """
    if 'application/json' in request.META.get('HTTP_ACCEPT', ''):
        return JsonResponse({
            'project': 'ApplineX - Smart Household Appliance Rental Platform',
            'status': 'online',
            'version': '1.0.0',
            'endpoints': {
                'admin': '/admin/',
                'auth': '/api/auth/',
                'appliances': '/api/appliances/',
                'rentals': '/api/rentals/',
                'payments': '/api/payments/',
                'reviews': '/api/reviews/',
                'maintenance': '/api/maintenance/',
                'support': '/api/support/',
                'reports': '/api/reports/',
                'ai': '/api/ai/',
                'upload': '/api/upload/',
            },
            'frontend_url': 'http://localhost:5173/'
        })

    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ApplineX Backend API - Online</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            color: #F8FAFC;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
        }
        .card {
            background: rgba(30, 41, 59, 0.85);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 18px;
            max-width: 680px;
            width: 100%;
            padding: 2.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.15);
            color: #34D399;
            border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 0.82rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            margin-bottom: 1.25rem;
        }
        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 10px #10B981;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
        }
        h1 {
            font-size: 2rem;
            font-weight: 800;
            color: #FFFFFF;
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
        }
        p.sub {
            color: #94A3B8;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .action-box {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 1.25rem;
            text-decoration: none;
            color: inherit;
            display: block;
            transition: all 0.2s ease;
        }
        .action-box:hover {
            border-color: #3B82F6;
            transform: translateY(-2px);
            background: rgba(15, 23, 42, 0.9);
        }
        .action-title {
            font-size: 1rem;
            font-weight: 700;
            color: #60A5FA;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .action-desc {
            font-size: 0.82rem;
            color: #94A3B8;
            line-height: 1.4;
        }
        .code-box {
            background: #0B1120;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 10px;
            padding: 1rem 1.25rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            color: #CBD5E1;
        }
        .code-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
        }
        .code-label { color: #64748B; }
        .code-val { color: #38BDF8; }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">
            <span class="dot"></span>
            DJANGO API SERVER ACTIVE &amp; HEALTHY
        </div>
        <h1>ApplineX Backend Service</h1>
        <p class="sub">
            This is the Django REST API server powering the ApplineX Smart Household Appliance Rental platform. The interactive user interface is running on the frontend server.
        </p>

        <div class="grid">
            <a href="http://localhost:5173/" class="action-box" target="_blank">
                <div class="action-title">
                    Frontend Web App <span>&rarr;</span>
                </div>
                <div class="action-desc">
                    Open the user-facing web app (catalog, booking, dashboard, profile, reviews) on port 5173.
                </div>
            </a>

            <a href="/admin/" class="action-box">
                <div class="action-title">
                    Django Admin Panel <span>&rarr;</span>
                </div>
                <div class="action-desc">
                    Manage database records, appliances, rentals, payments, maintenance, and users.
                </div>
            </a>
        </div>

        <div class="code-box">
            <div class="code-row">
                <span class="code-label">Status:</span>
                <span class="code-val" style="color:#34D399;">200 OK &bull; Connected</span>
            </div>
            <div class="code-row">
                <span class="code-label">API Endpoints:</span>
                <span class="code-val">/api/appliances/ &bull; /api/rentals/ &bull; /api/auth/</span>
            </div>
            <div class="code-row">
                <span class="code-label">Media Serving:</span>
                <span class="code-val">/media/uploads/ &bull; /media/avatars/</span>
            </div>
            <div class="code-row">
                <span class="code-label">Admin Login:</span>
                <span class="code-val">admin@applinex.com &bull; Admin@123</span>
            </div>
        </div>
    </div>
</body>
</html>"""
    return HttpResponse(html_content)
