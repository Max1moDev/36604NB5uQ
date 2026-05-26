async function cargarUsuarioDiscord(discordId, htmlIds) {
    try {
        const respuesta = await fetch(`https://discord-lookup-api-alpha.vercel.app/v1/user/${discordId}`);
        if (!respuesta.ok) return;
        const data = await respuesta.json();

        if (htmlIds.nombre) {
            const elNombre = document.getElementById(htmlIds.nombre);
            if (elNombre) elNombre.textContent = data.global_name || data.username;
        }

        if (htmlIds.tag) {
            const elTag = document.getElementById(htmlIds.tag);
            if (elTag) elTag.textContent = `${data.username}`;
        }

        if (htmlIds.avatar) {
            const elAvatar = document.getElementById(htmlIds.avatar);
            if (elAvatar) elAvatar.src = data.avatar ? data.avatar.link : 'https://cdn.discordapp.com/embed/avatars/0.png';
        }

        if (htmlIds.banner && data.banner) {
            const elBanner = document.getElementById(htmlIds.banner);
            if (elBanner) elBanner.src = data.banner.link;
        }

        if (htmlIds.marco) {
            const elMarco = document.getElementById(htmlIds.marco);
            if (elMarco) {
                if (data.avatar_decoration) {
                    elMarco.src = `https://cdn.discordapp.com/avatar-decoration-presets/${data.avatar_decoration.asset}.png?size=512&passthrough=true`;
                    elMarco.style.display = 'block';
                } else {
                    elMarco.style.display = 'none';
                }
            }
        }

    } catch (error) {
        console.error(`Error cargando los datos del usuario ${discordId}:`, error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarioDiscord("837149144476155905", {
        nombre: "mv_discord_name",
        avatar: "mv_discord_avatar",
        tag: "mv_discord_tag",
        banner: "mv_discord_banner",
        marco: "mv_discord_frame"
    });
});