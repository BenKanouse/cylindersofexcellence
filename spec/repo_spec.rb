require 'spec_helper'

describe Repo do

  let(:file_to_blame) { "spec/support/file_to_blame.rb" }
  let(:first_silo) { repo.silos.find { |silo| silo.file_name == file_to_blame } }
  let(:repo) { Repo.new('railsrumble/r14-team-290') }

  specify { expect(repo.name).to eq("r14-team-290") }
  specify { expect(repo.url).to eq("https://github.com/railsrumble/r14-team-290.git") }
  specify { expect(repo.owner_and_name).to eq("railsrumble/r14-team-290") }
  #specify { expect(repo.user_avatars.first).to eq(["booch", "https://avatars.githubusercontent.com/u/7849?v=2"]) }

  it 'clones the repo' do
    repo.silos
    expect(Dir.exists?("tmp/repos/railsrumble/r14-team-290")).to be(true)
  end

  describe "#silos" do
    subject { first_silo }
    specify { expect(subject.person).to eq("BenKanouse") }
    specify { expect(subject.lines_for_person).to eq(36) }
    specify { expect(subject.total_lines).to eq(41) }
  end

  describe "to_json" do
    subject { first_silo.as_json }
    specify { expect(subject["file_name"]).to eq(file_to_blame) }
    specify { expect(subject["lines_for_person"]).to eq(36) }
    specify { expect(subject["person"]).to eq("BenKanouse") }
    specify { expect(subject["total_lines"]).to eq(41) }
  end
end
