IMAGES=(spotify-anki-frontend-prod spotify-anki-backend-prod spotify-anki-nginx-prod)
for image in ${IMAGES[@]}; do
    echo "Importing image $image"
    zcat $image.tar.gz | docker import - $image:latest
done
