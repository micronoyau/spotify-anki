IMAGES=(spotify-anki-frontend-prod spotify-anki-backend-prod spotify-anki-nginx-prod)
for image in ${IMAGES[@]}; do
    echo "Loading image $image"
    docker image load -i $image.tar
done
