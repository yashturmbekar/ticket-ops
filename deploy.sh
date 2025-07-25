echo "Removing local modifications" && \
git reset --hard origin/$1 && \

echo "Taking latest pull from branch" && \
git pull origin $1 && \

echo "Removing cached images" && \
docker system prune -af --volumes && \ 

echo "Changing working directory to directory which has docker compose file" && \
cd .. && \


echo "Build and run docker conatiner" && \
docker compose up -d --build $2 