from django.shortcuts import render, redirect, reverse, get_object_or_404
from .models import DireccionEnvio
from django.views.generic import ListView, DeleteView
from .forms import DireccionEnvioForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import UpdateView
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse_lazy
from carts.funciones import funcionCarrito
from orden.utils import funcionOrden
from django.http.response import HttpResponseRedirect

#la herencia LoginRequiredMixin si no esta logueado la pagina direccionenvio no cargaria, por lo que redirige a login, TIENE que estar primero de herencia
class EnvioDirecciones(LoginRequiredMixin, ListView):
    #LoginRequiredMixin, este redige al login si no estan logueados
    login_url='login'
    model = DireccionEnvio
    template_name = 'direccion_envios/direccion_envio.html'

    def get_queryset(self):
        return DireccionEnvio.objects.filter(user=self.request.user).order_by('-default')
    

#decorador, si no esta logueado la pagina direccionenvio no cargaria, por lo que redirige a login
@login_required(login_url='login')
def formularioDir(request):
    form = DireccionEnvioForm(request.POST or None)
    
    if request.method == 'POST' and form.is_valid():
        #como el formulario no guarda el usuario no se guarda en la BD, aqui se instancia unicamente
        direccion_envio = form.save(commit=False)
        #Aqui se agrega el usuario
        direccion_envio.user = request.user       
        #se valida si es la primer direccion, si lo es la pone como default, si no es, no cumple la condicion
        direccion_envio.default = not request.user.has_direccion_envio()
        
        direccion_envio.save()
        
        if request.GET.get('next'):
            if request.GET['next'] == reverse('direccion'):
                cart = funcionCarrito(request)
                orden = funcionOrden(cart,request)
                
                orden.update_direccion_envio(direccion_envio)
                
                return HttpResponseRedirect(request.GET['next'])
        
        messages.success(request,'Dirección guardada correctamente')
        return redirect('direccion_envio')
    
    return render(request, 'direccion_envios/formulario.html',{
        'form':form
    })
    
class UpdateDireccion(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    login_url='login'
    model = DireccionEnvio
    form_class = DireccionEnvioForm
    template_name = 'direccion_envios/actualizar.html'
    success_message = 'Dirección actualizada con éxito'
    
    def get_success_url(self):
        return reverse('direccion_envio')
    
class DeleteDireccion(LoginRequiredMixin, DeleteView):
    login_url= 'login'
    model = DireccionEnvio
    template_name = 'direccion_envios/delete.html'
    success_url = reverse_lazy('direccion_envio')
    
    def dispatch(self, request, *args, **kwargs):
        if self.get_object().default:
            return redirect('direccion_envio')
        
        if self.get_object().has_orden():
            messages.error(request, 'No puedes eliminar una direccion asociada a una orden')
            return redirect('direccion_envio')
        
        if request.user.id != self.get_object().user_id:
            return redirect('index')
        
        return super(DeleteDireccion, self).dispatch(request, *args, **kwargs)
    
@login_required(login_url='login')
def funcDefault(request,pk):
    direccion_envio = get_object_or_404(DireccionEnvio, pk=pk)
    
    if request.user.id != direccion_envio.user_id:
        return redirect('index')
    
    if request.user.has_direccion_envio():
        request.user.direccion_envio.update_default()
        
    direccion_envio.update_default(True)
    
    return redirect('direccion_envio')