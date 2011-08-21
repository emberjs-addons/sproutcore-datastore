require 'bundler/setup'
require "erb"
require "uglifier"
require "sproutcore"

module SproutCore
  module Compiler
    class Entry
      def body
        "\n(function(exports) {\n#{@raw_body}\n})({});\n"
      end
    end
  end
end

def strip_require(file)
  result = File.read(file)
  result.gsub!(%r{^\s*require\(['"]([^'"])*['"]\);?\s*$}, "")
  result
end

def strip_sc_assert(file)
  result = File.read(file)
  result.gsub!(%r{^(\s)+sc_assert\((.*)\).*$}, "")
  result
end

def uglify(file)
  uglified = Uglifier.compile(File.read(file))
  "#{LICENSE}\n#{uglified}"
end

SproutCore::Compiler.intermediate = "tmp/intermediate"
SproutCore::Compiler.output       = "tmp/static"

# Create a compile task for a SproutCore package. This task will compute
# dependencies and output a single JS file for a package.
def compile_package_task(package)
  js_tasks = SproutCore::Compiler::Preprocessors::JavaScriptTask.with_input "packages/#{package}/lib/**/*.js", "."
  SproutCore::Compiler::CombineTask.with_tasks js_tasks, "#{SproutCore::Compiler.intermediate}/#{package}"
end

# Create sproutcore:package tasks for each of the SproutCore packages
namespace :sproutcore do
  %w(datastore indexset).each do |package|
    task package => compile_package_task("sproutcore-#{package}")
  end
end

task :build => ['sproutcore:datastore', 'sproutcore:indexset']

file "dist/sproutcore-datastore.js" => :build do
  puts "Generating sproutcore-datastore.js"

  mkdir_p "dist"

  File.open("dist/sproutcore-datastore.js", "w") do |file|
    # TODO: make it generate to tmp/static/sproutcore-datastore.js
    file.puts strip_require("tmp/static/sproutcore-indexset.js")
    file.puts strip_require("tmp/static/sproutcore-datastore.js")
  end
end

task :default => :"dist/sproutcore-datastore.js"
