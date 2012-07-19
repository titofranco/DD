source 'https://rubygems.org'

gem 'rails', '3.2.3'
gem "mysql2", "~> 0.3.6"
gem 'json'
gem 'jquery-rails'
gem "algorithms"

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'uglifier', '>= 1.0.3'
  gem 'therubyracer', :platform => :ruby
end

group :development do
  gem "capistrano"
  gem "rvm-capistrano"
end

group :development, :test do
  gem "rspec-rails"
  gem 'database_cleaner'
  gem "capybara"
  gem "launchy"
end

group :test do
  gem "autotest"
  gem "cucumber-rails", ">= 0.3.2"
  gem "factory_girl_rails"
  gem "guard-rspec"
end

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

# Use unicorn as the app server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug'
