from rest_framework import status, views, permissions
from rest_framework.response import Response
from .models import SupportTicket, Complaint
from apps.reviews.models import Review
from .serializers import SupportTicketSerializer, ComplaintSerializer

class SupportTicketListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role in ['admin', 'support']:
            tickets = SupportTicket.objects.all()
        else:
            tickets = SupportTicket.objects.filter(customer=request.user)

        status_param = request.GET.get('status')
        if status_param and status_param != 'all':
            tickets = tickets.filter(status=status_param)

        return Response(SupportTicketSerializer(tickets, many=True).data)

    def post(self, request):
        serializer = SupportTicketSerializer(data=request.data)
        if serializer.is_valid():
            ticket = serializer.save(customer=request.user)
            return Response(SupportTicketSerializer(ticket).data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class SupportTicketDetailUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            ticket = SupportTicket.objects.get(pk=pk)
        except SupportTicket.DoesNotExist:
            return Response({'error': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in ['admin', 'support'] and ticket.customer != request.user:
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(SupportTicketSerializer(ticket).data)

    def put(self, request, pk):
        try:
            ticket = SupportTicket.objects.get(pk=pk)
        except SupportTicket.DoesNotExist:
            return Response({'error': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in ['admin', 'support'] and ticket.customer != request.user:
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = SupportTicketSerializer(ticket, data=request.data, partial=True)
        if serializer.is_valid():
            ticket = serializer.save()
            return Response(SupportTicketSerializer(ticket).data)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            ticket = SupportTicket.objects.get(pk=pk)
            ticket.delete()
            return Response({'message': 'Ticket deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except SupportTicket.DoesNotExist:
            return Response({'error': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)

class ComplaintListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role in ['admin', 'support']:
            complaints = Complaint.objects.all()
        else:
            complaints = Complaint.objects.filter(customer=request.user)

        status_param = request.GET.get('status')
        if status_param and status_param != 'all':
            complaints = complaints.filter(status=status_param)

        return Response(ComplaintSerializer(complaints, many=True).data)

    def post(self, request):
        serializer = ComplaintSerializer(data=request.data)
        if serializer.is_valid():
            complaint = serializer.save(customer=request.user)
            return Response(ComplaintSerializer(complaint).data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ComplaintDetailUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in ['admin', 'support'] and complaint.customer != request.user:
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(ComplaintSerializer(complaint).data)

    def put(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in ['admin', 'support'] and complaint.customer != request.user:
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ComplaintSerializer(complaint, data=request.data, partial=True)
        if serializer.is_valid():
            complaint = serializer.save()
            return Response(ComplaintSerializer(complaint).data)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            complaint = Complaint.objects.get(pk=pk)
            complaint.delete()
            return Response({'message': 'Complaint deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found.'}, status=status.HTTP_404_NOT_FOUND)

class SupportDashboardOverviewView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        open_tickets = SupportTicket.objects.filter(status__in=['open', 'in_progress']).count()
        open_complaints = Complaint.objects.filter(status__in=['open', 'in_progress']).count()
        pending_reviews = Review.objects.filter(status='pending').count()

        recent_tickets = SupportTicket.objects.all()[:5]
        recent_complaints = Complaint.objects.all()[:5]
        recent_reviews = Review.objects.filter(status='pending')[:5]

        from apps.reviews.serializers import ReviewSerializer

        return Response({
            'kpis': {
                'open_tickets': open_tickets,
                'complaints': open_complaints,
                'pending_reviews': pending_reviews,
            },
            'recent_tickets': SupportTicketSerializer(recent_tickets, many=True).data,
            'recent_complaints': ComplaintSerializer(recent_complaints, many=True).data,
            'recent_reviews': ReviewSerializer(recent_reviews, many=True).data,
        })
