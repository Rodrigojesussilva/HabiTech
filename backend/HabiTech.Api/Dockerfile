FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source

COPY ["HabiTech.Api.csproj", "./"]
RUN dotnet restore "HabiTech.Api.csproj"

COPY . .
RUN dotnet publish "HabiTech.Api.csproj" --configuration Release --output /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "HabiTech.Api.dll"]
