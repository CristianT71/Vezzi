const API_URL = 'http://localhost:3000/api';
    const usuarioSelect = document.getElementById('usuario');
    const usersPreview = document.getElementById('usersPreview');
    const mensaje = document.getElementById('mensaje');

    function roleClass(nombre) {
      const text = String(nombre || '').toLowerCase();
      return text.includes('admin') ? 'admin' : 'user';
    }

    function showMessage(text, error = true) {
      mensaje.style.color = error ? '#fecaca' : '#bbf7d0';
      mensaje.textContent = text;
    }

    async function api(path) {
      const res = await fetch(`${API_URL}${path}`);
      let data;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }
      if (!res.ok) throw data;
      return data;
    }

    async function cargarUsuarios() {
      showMessage('Cargando usuarios...', false);
      try {
        const usuarios = await api('/usuario');
        usuarioSelect.innerHTML = '<option value="">Seleccione un usuario</option>';
        usersPreview.innerHTML = '';

        if (!usuarios.length) {
          showMessage('No hay usuarios creados. Primero crea uno en tus formularios de prueba.', true);
          return;
        }

        usuarios.forEach((usuario) => {
          const option = document.createElement('option');
          option.value = usuario.id;
          option.textContent = `${usuario.nombre_usuario} · ${usuario.rol?.nombre || 'Sin rol'}`;
          usuarioSelect.appendChild(option);

          const item = document.createElement('div');
          item.className = 'user-pill';
          item.innerHTML = `
            <div class="user-meta">
              <strong>${usuario.nombre_usuario}</strong>
              <span>${usuario.nombre_completo || 'Sin nombre'} </span>
            </div>
            <span class="badge ${roleClass(usuario.rol?.nombre)}">${usuario.rol?.nombre || 'Sin rol'}</span>
          `;
          usersPreview.appendChild(item);
        });

        showMessage('Usuarios cargados. Ya puedes entrar.', false);
      } catch (error) {
        showMessage('No se pudieron cargar los usuarios. Revisa si el backend está encendido y CORS activo.\n\n' + JSON.stringify(error, null, 2), true);
      }
    }

    document.getElementById('btnEntrar').addEventListener('click', async () => {
      const id = usuarioSelect.value;
      if (!id) {
        showMessage('Selecciona un usuario para entrar.');
        return;
      }

      try {
        const usuarios = await api('/usuario');
        const user = usuarios.find((u) => u.id === id);
        if (!user) {
          showMessage('El usuario seleccionado ya no existe.');
          return;
        }
        sessionStorage.setItem('vezzi_current_user', JSON.stringify(user));
        window.location.href = 'panel.html';
      } catch (error) {
        showMessage('No fue posible iniciar el acceso demo.\n\n' + JSON.stringify(error, null, 2), true);
      }
    });

    document.getElementById('btnRecargar').addEventListener('click', cargarUsuarios);
    cargarUsuarios();