# Use an official lightweight web server image
FROM nginx:alpine

# Copy your generated MkDocs site into Nginx's html directory
COPY site/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]